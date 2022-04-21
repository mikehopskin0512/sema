import { v4 as uuid } from "uuid";
import { COMPONENTS_TYPES, DND_CASES_CHECKS, ELEM_TYPES, SNAPSHOTS_TYPES } from '../../../portfolios/dashboard/dnd/constants';
import { EmptySnapshot } from "../../../snapshots/snapshot/EmptySnapshot";
import ChartSnapshot from "../../../snapshots/snapshot/ChartSnapshot";
import CommentSnapshot from "../../../snapshots/snapshot/CommentSnapshot";
import { getEmptyColumn } from "./manipulations";
import { putPortfolio } from "../../../../state/features/portfolios/api";
import { notify } from "../../../toaster/index";
import { differenceWith } from "lodash/array";
import { isEqual } from "lodash";

const sortSnapshotsByType = (items) => {
  if (!items.length) return {};
  return items.reduce((acc, item) => {
    if (item.componentType === SNAPSHOTS_TYPES.COMMENTS) {
      acc.comments.push(item);
    } else {
      acc.others.push(item);
    }
    return acc;
  }, {
    comments: [],
    others: [],
  });
};

const splitArrToChunks = (inputArray, chunkSize = 2) => {
  if (!inputArray) return [];
  return inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
};

const getInitialLayoutStructure = (items, portfolioData) => {
  const commentsLayout = items.comments?.map(item => ({
    type: ELEM_TYPES.ROW,
    id: uuid(),
    maxItemsCount: 1,
    data: item,
    isIndependent: true,
    componentToRender: COMPONENTS_TYPES.COMMENTS,
    componentProps: {
      portfolioId: portfolioData?._id,
      snapshotData: item,
    },
  })) ?? [];

  const otherLayout = splitArrToChunks(items.others)
    .map(item => {
      return {
        type: ELEM_TYPES.ROW,
        id: uuid(),
        isIndependent: false,
        children: item.map(item => ({
          type: ELEM_TYPES.COLUMN,
          componentToRender: COMPONENTS_TYPES.CHART,
          componentProps: {
            portfolioId: portfolioData?._id,
            snapshotData: item,
          },
          id: item._id,
          ...item,
        })),
        data: null,
      };
    });

  // Add placeholder for droppable item if its needed
  const lastItemChildren = otherLayout?.[otherLayout.length -1]?.children;

  if (lastItemChildren?.length === 1) {
    lastItemChildren?.push(getEmptyColumn());
  }
  return [...commentsLayout, ...otherLayout];
};

const getPageLayout = (items, portfolioData) => {
  const parsedItems = sortSnapshotsByType(items);
  return getInitialLayoutStructure(parsedItems, portfolioData);
};

const getDraggableComponent = (type) => {
  switch (type) {
  case COMPONENTS_TYPES.EMPTY:
    return EmptySnapshot;
  case COMPONENTS_TYPES.CHART:
    return ChartSnapshot;
  case COMPONENTS_TYPES.COMMENTS:
    return CommentSnapshot;
  }
};

// To decrease amount of payload data we need to extract some info from it
const parseLayoutPayload = (layout) => {
  return layout.map(item => {
    if (item.isIndependent) {
      return {
        ...item,
        data: item.data._id,
      };
    } else {
      return {
        ...item,
        children: item.children?.map(child => {
          if (child.isEmpty) {
            return {
              id: child._id,
              isEmpty: true,
              componentToRender: child.componentToRender,
              componentProps: {},
            };
          } else {
            const {
              componentData,
              componentProps: {
                snapshotData,
                ...other
              },
              ...rest
            } = child;
            return {
              ...rest,
              componentProps: {
                ...other,
              },
            };
          }
        }),
      };
    }
  });
};

// Data should be restored before displaying on page after layout changes
const getSavedData = (savedLayout, snaps) => {
  return savedLayout.map(item => {
    if (item.isIndependent) {
      const data = snaps.find(i => i._id === item.data) ?? null;
      return {
        ...item,
        data,
      };
    } else {
      return {
        ...item,
        children: item.children?.map(child => {
          if (child.isEmpty) {
            return child;
          } else {
            const data = snaps?.find(i => i._id === child.id) ?? null;
            if (!data) return getEmptyColumn()
            return {
              ...child,
              componentData: data.componentData ?? {},
              componentProps: {
                ...child.componentProps,
                snapshotData: data,
              },
            };
          }
        }),
      };
    }
  })?.filter(i => {
    if (i.isIndependent) {
      return Boolean(i?.data);
    }

    return !(i.children && DND_CASES_CHECKS.EMPTY_CHILDREN_ROW(i));
  });
};

const changePortfolioOrder = async ({ portfolio, token, currentLayout }) => {
  const {
    _id,
    ...rest
  } = portfolio;
  if (_id && token) {
    const body = {
      _id,
      ...rest,
    };

    body.snapshots = body.snapshots.map(({
      id: snapshot,
      sort,
    }) => ({
      id: { _id: snapshot._id },
      sort,
    }));

    try {
      await putPortfolio(_id, {
        ...body,
        layout: parseLayoutPayload(currentLayout),
      }, token);
    } catch (error) {
      notify("Order change save failed", { type: "error" });
    }
  }
}

const getSnapsIds = (layout) => {
 return layout.reduce((acc, i) => {
   if (i.isIndependent) {
     acc.push(i.data);
   } else {
     i.children?.forEach(child => {
       acc.push(child?.id);
     })
   }
   return acc;
 }, [])
}

const getNewLayoutItems = (snapsIds, layoutIds) => {
  return differenceWith(snapsIds, layoutIds, isEqual);
}

export {
  sortSnapshotsByType,
  getInitialLayoutStructure,
  splitArrToChunks,
  getPageLayout,
  getDraggableComponent,
  parseLayoutPayload,
  getSavedData,
  changePortfolioOrder,
  getSnapsIds,
  getNewLayoutItems
};
