import _ from 'lodash';
import { SORTING_TYPES } from './constants';

const priorityCompareFactory = (basicCompare, fieldPath, priorityList) => (
  element1,
  element2
) => {
  const value1 = _.get(element1, fieldPath);
  const value2 = _.get(element2, fieldPath);
  if (_.isNil(value1)) {
    return 1;
  }
  if (_.isNil(value2)) {
    return -1;
  }
  const priorityIndex1 = priorityList.indexOf(value1);
  const priorityIndex2 = priorityList.indexOf(value2);
  if (priorityIndex1 >= 0 && priorityIndex2 >= 0) {
    return priorityIndex1 - priorityIndex2;
  }

  if (priorityIndex1 >= 0) {
    return -1;
  }
  if (priorityIndex2 >= 0) {
    return 1;
  }

  return basicCompare(value1, value2);
};

const alphabeticalCompare = (a, b) => {
  const valueA = a.trim();
  const valueB = b.trim();
  if (_.isEmpty(valueA)) {
    return 1;
  }
  if (_.isEmpty(valueB)) {
    return -1;
  }
  return valueA.localeCompare(valueB);
};

const defaultCompare = (a, b) => {
  if (a < b) return 1;
  if (a > b) return -1;
  return 0;
};

export const sortWithPriorityByCompare = (
  list,
  fieldPath,
  priorityList,
  baseicCompare
) => {
  const fullCompare = priorityCompareFactory(
    baseicCompare,
    fieldPath,
    priorityList
  );
  return list.sort(fullCompare);
};

export const sortWithPriority = (
  list,
  fieldPath,
  priorityList = [],
  sortType
) => {
  switch (sortType) {
    case SORTING_TYPES.ALPHABETICAL_SORT:
      return sortWithPriorityByCompare(
        list,
        fieldPath,
        priorityList,
        alphabeticalCompare
      );
    case SORTING_TYPES.DEFAULT_COMPARE_SORT:
      return sortWithPriorityByCompare(
        list,
        fieldPath,
        priorityList,
        defaultCompare
      );
  }
  return list;
};

export const getPriorityListFromUser = user => {
  return [
    _.get(user, 'identities[0].username'),
    _.get(user, 'username'),
    `${_.get(user, 'firstName')} ${_.get(user, 'lastName')}`
  ];
};
