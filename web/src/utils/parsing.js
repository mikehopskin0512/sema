import { find, findIndex, isEmpty } from 'lodash';
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  differenceInCalendarYears,
  format,
  subWeeks,
  subMonths,
  subYears,
  isWithinInterval,
  startOfDay,
  endOfDay,
  subDays,
} from 'date-fns';
import { EMOJIS, TAGS } from './constants';
import {
  generateChartDataByDays,
  generateChartDataByMonths,
  generateChartDataByYears,
  generateChartDataByWeeks,
} from './codeStats';

export const getEmoji = (id) => {
  const { emoji } = find(EMOJIS, { _id: id });
  return emoji;
};

export const getEmojiLabel = (id) => {
  const { label } = find(EMOJIS, { _id: id });
  return label;
};

export const getTagLabel = (id) => {
  const { label } = find(TAGS, { _id: id });
  return label;
};

export const setSmartCommentsDateRange = (
  smartcomments,
  startDate,
  endDate
) => {
  let startDay =
    smartcomments[smartcomments.length - 1]?.source.createdAt ||
    subDays(new Date(), 6);
  let endDay = new Date();
  if (startDate && endDate) {
    startDay = startDate;
    endDay = endDate;
  }
  const dateRange = getDateRangeGroup(startDay, endDay);
  const days = differenceInCalendarDays(new Date(endDay), new Date(startDay));
  let dates = {
    startDay,
    endDay,
    dateDiff: days,
  };
  switch (dateRange) {
    case 'day':
      return {
        ...dates,
        groupBy: 'day',
      };
    case 'week':
      return {
        ...dates,
        groupBy: 'week',
      };
    case 'month':
      return {
        ...dates,
        groupBy: 'month',
      };
    case 'year':
      return {
        ...dates,
        groupBy: 'year',
      };
    default:
      return dates;
  }
};

export const getDateSub = (startDate, endDate) => {
  const dateGroup = getDateRangeGroup(startDate, endDate);
  const end = format(new Date(endDate), 'MMM dd, yyyy');
  switch (dateGroup) {
    case 'day':
      return {
        startDate: format(
          new Date(subWeeks(new Date(startDate), 1)),
          'MMM dd, yyyy'
        ),
        endDate: end,
      };
    case 'week':
      return {
        startDate: format(
          new Date(subMonths(new Date(startDate), 1)),
          'MMM dd, yyyy'
        ),
        endDate: end,
      };
    case 'month':
      return {
        startDate: format(
          new Date(subYears(new Date(startDate), 1)),
          'MMM dd, yyyy'
        ),
        endDate: end,
      };
    case 'year':
      return {
        startDate: format(
          new Date(subYears(new Date(startDate), 10)),
          'MMM dd, yyyy'
        ),
        endDate: end,
      };
    default:
      return;
  }
};

export const getDateRangeGroup = (startDate, endDate) => {
  const startDay = new Date(startDate);
  const endDay = new Date(endDate);
  const days = differenceInCalendarDays(endDay, startDay);
  const weeks = differenceInCalendarWeeks(endDay, startDay);
  const months = differenceInCalendarMonths(endDay, startDay);
  const years = differenceInCalendarYears(endDay, startDay);
  if (days < 7 || (days < 15 && weeks <= 2)) {
    return 'day';
  }
  if (days >= 15 && weeks >= 2 && months <= 3) {
    return 'week';
  }
  if (months > 3 && years <= 1) {
    return 'month';
  }
  if (years >= 1) {
    return 'year';
  }
};

export const getReactionTagsChartData = ({
  smartComments,
  groupBy,
  dateDiff,
  startDate,
  endDate,
}) => {
  switch (groupBy) {
    case 'day':
      const { reactionsByDay, tagsByDay } = generateChartDataByDays(
        smartComments,
        dateDiff,
        startDate,
        endDate
      );
      return {
        reactionsChartData: reactionsByDay,
        tagsChartData: tagsByDay,
      };
    case 'week':
      const { reactionsByWeek, tagsByWeek } = generateChartDataByWeeks(
        smartComments,
        startDate,
        endDate
      );
      return {
        reactionsChartData: reactionsByWeek,
        tagsChartData: tagsByWeek,
      };
    case 'month':
      const { reactionsByMonth, tagsByMonth } = generateChartDataByMonths(
        smartComments,
        startDate,
        endDate
      );
      return {
        reactionsChartData: reactionsByMonth,
        tagsChartData: tagsByMonth,
      };
    case 'year':
      const { reactionsByYear, tagsByYear } = generateChartDataByYears(
        smartComments,
        startDate,
        endDate
      );
      return {
        reactionsChartData: reactionsByYear,
        tagsChartData: tagsByYear,
      };
    default:
      return;
  }
};

export const filterSmartComments = ({
  filter,
  smartComments = [],
  startDate,
  endDate,
}) => {
  let filtered = smartComments;
  if (
    !isEmpty(filter.from) ||
    !isEmpty(filter.to) ||
    !isEmpty(filter.reactions) ||
    !isEmpty(filter.tags) ||
    !isEmpty(filter.search) ||
    !isEmpty(filter.pr) ||
    (startDate && endDate)
  ) {
    filtered = smartComments.filter((item) => {
      const isWithinDateRange =
        startDate && endDate
          ? isWithinInterval(new Date(item.source.createdAt), {
              start: startOfDay(new Date(startDate)),
              end: endOfDay(new Date(endDate)),
            })
          : false;
      const fromIndex = item?.userId
        ? findIndex(filter.from, { value: item.userId._id })
        : -1;
      const toIndex = item?.githubMetadata
        ? findIndex(filter.to, { value: item?.githubMetadata?.requester })
        : -1;
      const prIndex = item?.githubMetadata
        ? findIndex(filter.pr, { value: item?.githubMetadata?.pull_number })
        : -1;
      const reactionIndex = findIndex(filter.reactions, {
        value: item?.reaction,
      });
      const tagsIndex = item?.tags
        ? findIndex(
            filter.tags,
            (tag) =>
              findIndex(
                item.tags,
                (commentTag) => commentTag._id === tag.value
              ) !== -1
          )
        : -1;
      const searchBool = item?.comment
        ?.toLowerCase()
        .includes(filter.search.toLowerCase());
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
      if (startDate && endDate) {
        filterBool = filterBool && isWithinDateRange;
      }
      return filterBool;
    });
  }
  return filtered;
};

export const parseSnapshotData = (snapshotData) => {
  const result = [...snapshotData];
  return result.map((smartComment) => ({
    smartCommentId: smartComment._id || smartComment.smartCommentId,
  }));
};
