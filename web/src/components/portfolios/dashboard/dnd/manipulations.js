import { v4 as uuid } from "uuid";
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
  const transformedChildren = swapArrayElements(requiredElement.children, oldPosition.join('-'), newPosition[0]);
  result.splice(index, 1, {
    ...requiredElement,
    children: transformedChildren.filter(i => !!i),
  });
  return updater(result);
};

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

  data[oldPosition[0]]?.children?.splice(oldPosition[1], 1, getEmptyColumn());

  if (DND_CASES_CHECKS.EMPTY_CHARTS_ROW(data, oldPosition[0])) {
    data.splice(oldPosition[0], 1);
  }

  data.splice(newPosition[0], 0, {
    children: [itemToSet.data, getEmptyColumn()],
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
  replaceChildInAnotherParent,
  createAdditionalItemsRow,
  getEmptyColumn
};
