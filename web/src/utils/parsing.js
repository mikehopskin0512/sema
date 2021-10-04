import { find, findIndex, isEmpty } from 'lodash';
import { differenceInCalendarDays } from 'date-fns';
import { EMOJIS, TAGS, DAYS_IN_WEEK, DAYS_IN_MONTH, DAYS_IN_YEAR } from './constants';
import { generateChartDataByDays, generateChartDataByWeeks, generateChartDataByMonths, generateChartDataByYears } from './codeStats';

export const getEmoji = (id) => {
  const { emoji } = find(EMOJIS, { _id: id });
  return emoji;
};

export const getTagLabel = (id) => {
  const { label } = find(TAGS, { _id: id });
  return label;
};

export const setSmartCommentsDateRange = (smartcomments, startDate, endDate) => {
  let startDay = smartcomments[smartcomments.length - 1]?.createdAt || subDays(new Date(), 6);
  let endDay = new Date();
  if (startDate && endDate) {
    startDay = startDate;
    endDay = endDate;
  }
  const diff = differenceInCalendarDays(new Date(endDay), new Date(startDay));
  let dates = {
    startDay,
    endDay,
    dateDiff: diff
  }
  if (diff < DAYS_IN_WEEK + 1) {
    dates = {
      ...dates,
      groupBy: 'day'
    };
  }
  if (diff < DAYS_IN_MONTH && diff >= DAYS_IN_WEEK) {
    dates = {
      ...dates,
      groupBy: 'week'
    };
  }
  if (diff < DAYS_IN_YEAR && diff >= DAYS_IN_MONTH) {
    dates = {
      ...dates,
      groupBy: 'month'
    };
  }
  if (diff >= DAYS_IN_YEAR) {
    dates = {
      ...dates,
      groupBy: 'year'
    };
  }
  return dates;
};

export const getReactionTagsChartData = ({ smartComments, groupBy, dateDiff, startDate, endDate }) => {
  switch (groupBy) {
    case 'day':
      const { reactionsByDay, tagsByDay } = generateChartDataByDays(smartComments, dateDiff, endDate);
      return {
        reactionsChartData: reactionsByDay,
        tagsChartData: tagsByDay
      };
    case 'week':
      const { reactionsByWeek, tagsByWeek } = generateChartDataByWeeks(smartComments, startDate, endDate);
      return {
        reactionsChartData: reactionsByWeek,
        tagsChartData: tagsByWeek
      };
    case 'month':
      const { reactionsByMonth, tagsByMonth } = generateChartDataByMonths(smartComments, startDate, endDate);
      return {
        reactionsChartData: reactionsByMonth,
        tagsChartData: tagsByMonth
      };
    case 'year':
      const { reactionsByYear, tagsByYear } = generateChartDataByYears(smartComments, startDate, endDate);
      return {
        reactionsChartData: reactionsByYear,
        tagsChartData: tagsByYear
      };
    default:
      return;
  }
}

export const filterSmartComments = ({ filter, smartComments }) => {
  let filtered = smartComments || [];
  if (
    !isEmpty(filter.from) ||
    !isEmpty(filter.to) ||
    !isEmpty(filter.reactions) ||
    !isEmpty(filter.tags) ||
    !isEmpty(filter.search) ||
    !isEmpty(filter.pr)
  ) {
    filtered = smartComments.filter((item) => {
      const fromIndex = item?.userId ? findIndex(filter.from, { value: item.userId._id }) : -1;
      const toIndex = item?.githubMetadata ? findIndex(filter.to, { value: item?.githubMetadata?.requester }) : -1;
      const prIndex = item?.githubMetadata ? findIndex(filter.pr, { value: item?.githubMetadata?.pull_number }) : -1;
      const reactionIndex = findIndex(filter.reactions, { value: item?.reaction });
      const tagsIndex = item?.tags ? findIndex(filter.tags, (tag) => findIndex(item.tags, (commentTag) => commentTag._id === tag.value) !== -1) : -1;
      const searchBool = item?.comment?.toLowerCase().includes(filter.search.toLowerCase());
      let filterBool = true;
      if (!isEmpty(filter.from)) {
        filterBool = filterBool && fromIndex !== -1;
      }
      if (!isEmpty(filter.to)) {
        filterBool = filterBool && toIndex !== -1;
      }
      if (!isEmpty(filter.reactions)) {
        filterBool = filterBool && reactionIndex !== -1;
      }
      if (!isEmpty(filter.tags)) {
        filterBool = filterBool && tagsIndex !== -1;
      }
      if (!isEmpty(filter.search)) {
        filterBool = filterBool && searchBool;
      }
      if (!isEmpty(filter.pr)) {
        filterBool = filterBool && prIndex !== -1;
      }
      return filterBool;
    });
  }
  return filtered;
}