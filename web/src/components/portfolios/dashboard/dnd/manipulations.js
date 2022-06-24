import { v4 as uuid } from 'uuid';
import { COMPONENTS_TYPES, DND_CASES_CHECKS } from './constants';

const reorderIndependentRow = ({
  oldPosition,
  newPosition,
  currentLayout,
  updater,
}) => {
  const result = Array.from(currentLayout);
  const [removed] = result.splice(oldPosition, 1);
  result.splice(newPosition, 0, removed);
  return updater(result);
};

const swapArrayElements = function (arr, x, y) {
  if (arr.length === 1) return arr;
  arr.splice(y, 1, arr.splice(x, 1, arr[y])[0]);
  return arr;
};

const reorderChildInRow = ({
  index,
  oldPosition,
  newPosition,
  currentLayout,
  updater,
}) => {
  if (oldPosition.join('-') === newPosition.join('-')) return;

  const result = Array.from(currentLayout);
  const requiredElement = result[index];
  const transformedChildren = swapArrayElements(requiredElement.children, oldPosition[1], newPosition[1]);

  result.splice(index, 1, {
    ...requiredElement,
    children: transformedChildren.filter(i => !!i),
  });
  return updater(result);
};

const changeChildDirection = ({
  path,
  currentLayout,
  updater,
}) => {
  const data = [...currentLayout];
  const splitPath = path.split('-');

  const itemPosition = parseInt(splitPath?.[1]);
  const rowPosition = parseInt(splitPath?.[0]);
  const isHorizontal = data[splitPath[0]]?.children[splitPath[1]]?.isHorizontal;
  const elemToSet = data[splitPath[0]]?.children[splitPath[1]];

  const transformedElem = {
    ...elemToSet,
    isHorizontal: !isHorizontal,
    componentProps: {
      ...elemToSet.componentProps,
      snapshotData: {
        ...elemToSet?.componentProps?.snapshotData,
        isHorizontal: !isHorizontal,
      },
    },
  }

  if (!isHorizontal) {
      data.splice(rowPosition, 0, {
        children: [transformedElem],
        data: null,
        id: uuid(),
        type: "row",
      });
      data[rowPosition + 1].children?.splice(itemPosition, 1, getEmptyColumn());

      if (data[rowPosition + 1]?.children?.every(child => child.isEmpty)) {
        data.splice(rowPosition + 1, 1);
      }

    } else {
        const previousRow = data[rowPosition + 1];
        if  (previousRow) {
          const isEmptyInRow = previousRow.children?.some(child => child.isEmpty);
          if (isEmptyInRow) {
            const emptyElemIndex =  previousRow.children?.findIndex(child => child.isEmpty);

            data.splice(rowPosition + 1, 1, {
              children: emptyElemIndex === 0 ? [transformedElem,  previousRow.children[1]] : [previousRow.children[0], transformedElem],
              data: null,
              id: uuid(),
              type: "row",
            });

            data.splice(rowPosition, 1);
          } else {
            data.splice(rowPosition, 1, {
              children: [transformedElem, getEmptyColumn()],
              data: null,
              id: uuid(),
              type: "row",
            });
          }
        } else {
          data.splice(rowPosition, 1, {
            children: [transformedElem,  getEmptyColumn()],
            data: null,
            id: uuid(),
            type: "row",
          });
        }
    }

  return updater(data);
}

const replaceChildInAnotherParent = ({
  oldPosition,
  newPosition,
  currentLayout,
  updater,
}) => {
  const data = [...currentLayout];
  const sourceElem = data[oldPosition[0]]?.children[oldPosition[1]];
  const targetElem = data[newPosition[0]]?.children[newPosition[1]];

  data[newPosition[0]]?.children.splice([newPosition[1]], 1, sourceElem);
  data[oldPosition[0]]?.children.splice([oldPosition[1]], 1, targetElem);

  if (DND_CASES_CHECKS.EMPTY_CHARTS_ROW(data, oldPosition[0])) {
    data.splice(oldPosition[0], 1);
  }

  return updater(data);
};

const getEmptyColumn = () => ({
  componentToRender: COMPONENTS_TYPES.EMPTY,
  _id: uuid(),
  type: "column",
  componentProps: {},
  isEmpty: true
})

const createAdditionalItemsRow = ({
  oldPosition,
  newPosition,
  currentLayout,
  itemToSet,
  updater,
}) => {
  const data = [...currentLayout];
  const isHorizontal = itemToSet.data.isHorizontal;

  isHorizontal ?
    data[oldPosition[0]]?.children?.splice(oldPosition[1], 1) :
    data[oldPosition[0]]?.children?.splice(oldPosition[1], 1, getEmptyColumn());

  if (DND_CASES_CHECKS.EMPTY_CHARTS_ROW(data, oldPosition[0])) {
    data.splice(oldPosition[0], 1);
  }

  data.splice(newPosition[0], 0, {
    children: isHorizontal ? [itemToSet.data] : [itemToSet.data, getEmptyColumn()],
    data: null,
    id: uuid(),
    isIndependent: false,
    type: "row",
  });

  return updater(data);
};

export {
  reorderIndependentRow,
  reorderChildInRow,
  changeChildDirection,
  replaceChildInAnotherParent,
  createAdditionalItemsRow,
  getEmptyColumn
};
