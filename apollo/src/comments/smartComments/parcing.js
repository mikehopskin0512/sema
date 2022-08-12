import {
  addMonths,
  addWeeks,
  addYears, differenceInCalendarDays, differenceInCalendarMonths, differenceInCalendarWeeks, differenceInCalendarYears,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  endOfDay,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isWithinInterval,
  startOfDay,
  startOfWeek,
  subDays,
} from 'date-fns';
import { findIndex, isEmpty, range, reverse } from 'lodash';

export const DAYS_IN_WEEK = 7;
export const YEAR_MONTH_DAY_FORMAT = `yyyy-MM-dd`;
export const DATE_TIME_FORMAT = 'MMM dd, yyyy hh:mm aa';
export const MONTH_DAY_FORMAT = 'MMM dd';
export const MONTH_DAY_YEAR_FORMAT = 'MMM dd, yyyy';

export const EMOJIS = [
  {
    _id: '607f0d1ed7f45b000ec2ed70',
    title: 'No reaction',
    label: 'No reaction',
    emoji: '⚪',
    github_emoji: ':white_circle:',
    color: '#9FE1F5',
  },
  {
    _id: '607f0d1ed7f45b000ec2ed71',
    title: 'This code is <b>awesome</b>',
    label: 'Awesome',
    emoji: '🏆',
    github_emoji: ':trophy:',
    color: '#212B36',
  },
  {
    _id: '607f0d1ed7f45b000ec2ed72',
    title: 'This code <b>looks good</b>',
    label: 'Looks good',
    emoji: '👌',
    github_emoji: ':ok_hand:',
    color: '#33C1EC',
  },
  {
    _id: '607f0d1ed7f45b000ec2ed73',
    title: 'I have a <b>question</b>',
    label: 'Question',
    emoji: '❓',
    github_emoji: ':question:',
    color: '#13A3CD',
  },
  {
    _id: '607f0d1ed7f45b000ec2ed74',
    title: 'This code <b>needs a fix</b>',
    label: 'Needs a fix',
    emoji: '🛠',
    github_emoji: ':hammer_and_wrench:',
    color: '#006D8D',
  },
];
export const TAGS = [
  {
    label: 'Readable',
    _id: '607f0594ab1bc1aecbe2ce4b',
    isPositive: true,
  },
  {
    label: 'Unreadable',
    _id: '607f0594ab1bc1aecbe2ce4c',
  },
  {
    label: 'Secure',
    _id: '607f0594ab1bc1aecbe2ce4d',
    isPositive: true,
  },
  {
    label: 'Not secure',
    _id: '607f0594ab1bc1aecbe2ce4e',
  },
  {
    label: 'Efficient',
    _id: '607f0594ab1bc1aecbe2ce4f',
    isPositive: true,
  },
  {
    label: 'Inefficient',
    _id: '607f0594ab1bc1aecbe2ce50',
  },
  {
    label: 'Elegant',
    _id: '607f0594ab1bc1aecbe2ce51',
    isPositive: true,
  },
  {
    label: 'Inelegant',
    _id: '607f0594ab1bc1aecbe2ce52',
  },
  {
    label: 'Reusable',
    _id: '607f0594ab1bc1aecbe2ce53',
    isPositive: true,
  },
  {
    label: 'Not reusable',
    _id: '607f0594ab1bc1aecbe2ce54',
  },
  {
    label: 'Fault-tolerant',
    _id: '607f0594ab1bc1aecbe2ce55',
    isPositive: true,
  },
  {
    label: 'Brittle',
    _id: '607f0594ab1bc1aecbe2ce56',
  },
  {
    label: 'Maintainable',
    _id: '607f0594ab1bc1aecbe2ce57',
    isPositive: true,
  },
  {
    label: 'Not maintainable',
    _id: '607f0594ab1bc1aecbe2ce58',
  },
];

const createTags = (tagsArr) => {
  let tags = {};
  TAGS.forEach((tag) => {
    tags[tag._id] = {
      total: 0,
      data: [...tagsArr],
    };
  });
  return tags;
};

const parseTagsAndReactions = (
  smartComments,
  dateFormat,
  reactionsData,
  tagsData,
  startDate,
  endDate,
) => {
  const reactionsArr = [...reactionsData];
  const tags = { ...tagsData };
  // Separate comments within and outside the time range
  const filteredComments = smartComments.filter((comment) =>
    isWithinInterval(new Date(comment.source?.createdAt || comment.createdAt), {
      start: startOfDay(new Date(startDate)),
      end: endOfDay(new Date(endDate)),
    }),
  );
  const outOfRangeComments = smartComments.filter(
    (comment) =>
      !isWithinInterval(
        new Date(comment.source?.createdAt || comment.createdAt),
        {
          start: startOfDay(new Date(startDate)),
          end: endOfDay(new Date(endDate)),
        },
      ),
  );
  // Count reactions and tags within the time range
  filteredComments.forEach((comment) => {
    const formattedDate = format(
      new Date(comment.source?.createdAt || comment.createdAt),
      dateFormat,
    );
    const reactionIndex = findIndex(reactionsArr, { date: formattedDate });
    if (reactionIndex > -1) {
      reactionsArr[reactionIndex][comment.reaction].current += 1;
    }
    comment.tags.forEach((tag) => {
      const tagsIndex = findIndex(tags[tag._id]?.data, { x: formattedDate });
      if (tagsIndex > -1) {
        tags[tag._id].total += 1;
        const tagData = tags[tag._id].data[tagsIndex];
        tags[tag._id].data[tagsIndex] = {
          ...tagData,
          y: tagData.y + 1,
        };
      }
    });
  });
  // Count reactions and tags outside the time range
  outOfRangeComments.forEach((comment) => {
    let formatDate;
    let index;
    switch (dateFormat) {
    case 'MM/dd':
      formatDate = format(
        addWeeks(new Date(comment.source?.createdAt || comment.createdAt), 1),
        dateFormat,
      );
      index = findIndex(reactionsArr, { date: formatDate });
      if (index > -1) {
        reactionsArr[index][comment.reaction].previous += 1;
      }
      return;
    case 'MMM':
      formatDate = format(
        addYears(new Date(comment.source?.createdAt || comment.createdAt), 1),
        dateFormat,
      );
      index = findIndex(reactionsArr, { date: formatDate });
      if (index > -1) {
        reactionsArr[index][comment.reaction].previous += 1;
      }
      return;
    case 'yyyy':
      formatDate = format(
        addYears(
          new Date(comment.source?.createdAt || comment.createdAt),
          10,
        ),
        dateFormat,
      );
      index = findIndex(reactionsArr, { date: formatDate });
      if (index > -1) {
        reactionsArr[index][comment.reaction].previous += 1;
      }
      return;
    default:
      return;
    }
  });
  return {
    reactions: reactionsArr,
    tags,
  };
};

const mergeTwoData = (reactions, type) => {
  let chart = [];
  reactions.reduce((previousValue, currentValue, currentIndex) => {
    if (currentIndex % 2) {
      const item = {
        ...(type == 'd' && {
          date: `${currentValue.date}-${format(
            new Date(previousValue.date),
            'dd',
          )}`,
        }),
        ...(type == 'm' && {
          date: `${currentValue.date}/${previousValue.date}`,
        }),
        ...(type == 'w' && {
          date: getDateRange(currentValue.date, previousValue.date),
        }),
      };
      EMOJIS.forEach((emoji) => {
        item[emoji._id] = {
          current:
            currentValue[emoji._id].current + previousValue[emoji._id].current,
          previous:
            currentValue[emoji._id].previous +
            previousValue[emoji._id].previous,
        };
      });
      chart.push(item);
    }
    if (currentIndex === reactions.length - 1) {
      chart.push(currentValue);
    }
    return currentValue;
  });
  return chart;
};

const reduceTagsData = (tags, type) => {
  let updatedTags = {};
  for (const [key, val] of Object.entries(tags)) {
    let updatedTagsArray = [];
    let tagsArray = val.data;
    if (type === 'm') {
      tagsArray = reverse(tagsArray);
    }
    tagsArray.reduce((previousValue, currentValue, currentIndex) => {
      if (currentIndex % 2) {
        switch (type) {
        case 'd':
          const itemDaily = {
            date: `${currentValue.x}-${format(
              new Date(previousValue.x),
              'dd',
            )}`,
            x: `${currentValue.x}-${format(new Date(previousValue.x), 'dd')}`,
            y: previousValue.y + currentValue.y,
          };
          updatedTagsArray.push(itemDaily);
          break;
        case 'w':
          const itemWeekly = {
            date: getDateRange(previousValue.date, currentValue.date),
            x: getDateRange(previousValue.date, currentValue.date),
            y: previousValue.y + currentValue.y,
          };
          updatedTagsArray.push(itemWeekly);
          break;
        case 'm':
          const itemMonthly = {
            x: `${currentValue.x}/${previousValue.x}`,
            y: previousValue.y + currentValue.y,
          };
          updatedTagsArray.push(itemMonthly);
          break;
        }
      }
      return currentValue;
    });
    if (type === 'm') {
      updatedTagsArray = reverse(updatedTagsArray);
    }
    updatedTags[key] = {
      total: val.total,
      data: updatedTagsArray,
    };
  }
  return updatedTags;
};

const getWeekByDateRange = (startDate, endDate) => {
  const WEEKS_COUNT = eachWeekOfInterval({
    start: startOfDay(new Date(startDate)),
    end: endOfDay(new Date(endDate)),
  }).length;
  const daysOfWeekRange = range(WEEKS_COUNT)
    .map((day) => {
      if (day === WEEKS_COUNT - 1) {
        return endOfDay(startDate);
      }
      return subDays(endDate, DAYS_IN_WEEK * day);
    });
  return reverse(daysOfWeekRange);
};

const getWeekRange = (weeks, startDate) => {
  let reactionsByWeek = [];
  const tagsArr = [];
  let weekRange = reverse(weeks)
    .map((week, index) => {
      let startDay = startOfDay(new Date(week));
      let endDay = endOfDay(new Date(week));
      if (weeks[index + 1]) {
        startDay = startOfDay(weeks[index + 1]);
      } else {
        startDay = startOfWeek(new Date(week));
      }
      if (isBefore(startDay, startDate)) {
        startDay = startOfDay(startDate);
      }
      if (isSameDay(startDay, endDay)) {
        return {};
      }
      const startWeekDay = format(startDay, MONTH_DAY_FORMAT);
      let endWeekDay = format(endDay, 'dd');
      endWeekDay = checkifEndOfMonth(startDay, endDay, endWeekDay);
      const item = {
        date: `${startWeekDay}-${endWeekDay}`,
      };
      EMOJIS.forEach((reaction) => {
        item[reaction._id] = {
          current: 0,
          previous: 0,
        };
      });
      reactionsByWeek.push(item);
      tagsArr.unshift({
        date: `${startWeekDay}-${endWeekDay}`,
        x: `${startWeekDay}-${endWeekDay}`,
        y: 0,
      });
      return {
        date: `${startWeekDay}-${endWeekDay}`,
        startDay,
        endDay,
      };
    });
  weekRange = weekRange.filter((week) => !isEmpty(week));
  return {
    weekRange,
    reactionsByWeek,
    tagsArr,
  };
};

const getDateRange = (previousRange, currentRange) => {
  const [currentFrom, currentTo] = currentRange.split('-');
  const [previousFrom, previousTo] = previousRange.split('-');
  const prevDay = previousFrom.replace(/[^0-9]/g, '');
  const currDay = currentTo.replace(/[^0-9]/g, '');
  let prevMonth = previousRange.replace(/[^a-zA-Z]/g, '');
  let currMonth = currentRange.replace(/[^a-zA-Z]/g, '');
  prevMonth = prevMonth.length > 3 ? prevMonth.slice(0, 3) : prevMonth;
  currMonth = currMonth.length > 3 ? currMonth.slice(3) : currMonth;
  /*
    Check if the the current range To date goes to next month
    Ex. Jan 28-Feb 0
  */
  if (currMonth === prevMonth) {
    return `${previousFrom}-${currentTo}`;
  }
  return `${prevMonth} ${prevDay}-${currMonth} ${currDay}`;
};

const checkifEndOfMonth = (startDay, endDay, endWeekDay) => {
  const endOfMonth = {
    true: format(endDay, MONTH_DAY_FORMAT),
    false: endWeekDay,
  };
  return endOfMonth[format(startDay, 'MMM') !== format(endDay, 'MMM')];
};

export const generateChartDataByDays = (
  smartComments,
  diff,
  startDate,
  endDate,
) => {
  let reactionsByDay = [];
  const tagsArr = [];
  let day = 0;
  // Should add +2 here because it's our step for the graph data splitting
  const countedDays = diff + 1;
  // Create Array of data for the BarChart
  while (day < countedDays) {
    const thisDay = subDays(endOfDay(new Date(endDate)), day);
    const item = {
      date: format(thisDay, MONTH_DAY_FORMAT),
    };
    // Set Reaction Ids as object keys
    EMOJIS.forEach((reaction) => {
      item[reaction._id] = {
        current: 0,
        previous: 0,
      };
    });
    reactionsByDay.push(item);
    tagsArr.push({
      x: format(thisDay, MONTH_DAY_FORMAT),
      y: 0,
    });
    day += 1;
  }
  const tagsByDay = createTags(tagsArr);
  let {
    reactions,
    tags,
  } = parseTagsAndReactions(
    smartComments,
    MONTH_DAY_FORMAT,
    reactionsByDay,
    tagsByDay,
    startDate,
    endDate,
  );
  if (diff > 6) {
    reactions = mergeTwoData(reactions, 'd');
    tags = reduceTagsData(tags, 'd');
  }
  return {
    reactionsByDay: reactions,
    tagsByDay: tags,
  };
};

export const generateChartDataByYears = (smartcomments, startDate, endDate) => {
  const years = eachYearOfInterval({
    start: startOfDay(new Date(startDate)),
    end: endOfDay(new Date(endDate)),
  });
  let reactionsByYear = [];
  const tagsArr = [];
  years.forEach((date) => {
    const month = new Date(date);
    const item = {
      date: format(month, 'yyyy'),
    };
    EMOJIS.forEach((reaction) => {
      item[reaction._id] = {
        current: 0,
        previous: 0,
      };
    });
    reactionsByYear.unshift(item);
    tagsArr.push({
      x: format(month, 'yyyy'),
      y: 0,
    });
  });
  const tagsByYear = createTags(tagsArr);
  const {
    reactions,
    tags,
  } = parseTagsAndReactions(
    smartcomments,
    'yyyy',
    reactionsByYear,
    tagsByYear,
    startDate,
    endDate,
  );
  return {
    reactionsByYear: reactions,
    tagsByYear: tags,
  };
};

export const generateChartDataByWeeks = (smartcomments, startDate, endDate) => {
  startDate = new Date(startDate);
  endDate = endOfDay(new Date(endDate));
  const weeks = getWeekByDateRange(startOfDay(startDate), endDate);
  let {
    weekRange,
    tagsArr,
    reactionsByWeek,
  } = getWeekRange(
    weeks,
    startDate,
    endDate,
  );
  weekRange = [...weekRange].reverse();
  let tagsByWeek = createTags(tagsArr);
  // Separate comments within and outside the date range
  const filteredComments = smartcomments.filter((comment) =>
    isWithinInterval(new Date(comment.source?.createdAt || comment.createdAt), {
      start: startOfDay(new Date(startDate)),
      end: endOfDay(new Date(endDate)),
    }),
  );
  const outOfRangeComments = smartcomments.filter(
    (comment) =>
      !isWithinInterval(
        new Date(comment.source?.createdAt || comment.createdAt),
        {
          start: startOfDay(new Date(startDate)),
          end: endOfDay(new Date(endDate)),
        },
      ),
  );
  // Count reactions and tags within time range
  filteredComments.forEach((comment) => {
    const itemRange = findIndex(weekRange, (item) =>
      isWithinInterval(
        new Date(comment.source?.createdAt || comment.createdAt),
        {
          start: item.startDay,
          end: item.endDay,
        },
      ),
    );
    const reactionIndex = findIndex(reactionsByWeek, {
      date: weekRange[itemRange]?.date,
    });
    if (reactionIndex > -1) {
      reactionsByWeek[reactionIndex][comment.reaction].current += 1;
    }
    comment.tags.forEach((tag) => {
      const tagsIndex = findIndex(tagsByWeek[tag._id]?.data, {
        date: weekRange[itemRange]?.date,
      });
      if (tagsIndex > -1) {
        tagsByWeek[tag._id].total += 1;
        const tagData = tagsByWeek[tag._id].data[tagsIndex];
        tagsByWeek[tag._id].data[tagsIndex] = {
          ...tagData,
          y: tagData.y + 1,
        };
      }
    });
  });
  // Count reactions outside the time range (will be saved to previous)
  outOfRangeComments.forEach((comment) => {
    const dayAfterAMonth = addMonths(
      new Date(comment.source?.createdAt || comment.createdAt),
      1,
    );
    const startWeek = format(startOfWeek(new Date(dayAfterAMonth)), 'MM/dd');
    const endWeek = format(endOfWeek(new Date(dayAfterAMonth)), 'MM/dd');
    const index = findIndex(reactionsByWeek, {
      date: `${startWeek}-${endWeek}`,
    });
    if (index > -1) {
      reactionsByWeek[index][comment.reaction].previous += 1;
    }
  });
  if (weeks.length > 13) {
    reactionsByWeek = mergeTwoData(reactionsByWeek, 'w');
    tagsByWeek = reduceTagsData(tagsByWeek, 'w');
  }
  return {
    reactionsByWeek,
    tagsByWeek,
  };
};

export const generateChartDataByMonths = (
  smartcomments,
  startDate,
  endDate,
) => {
  const months = eachMonthOfInterval({
    start: startOfDay(new Date(startDate)),
    end: endOfDay(new Date(endDate)),
  });
  let reactionsByMonth = [];
  const tagsArr = [];
  months.forEach((date) => {
    const month = new Date(date);
    const item = {
      date: format(month, 'MMM'),
    };
    EMOJIS.forEach((reaction) => {
      item[reaction._id] = {
        current: 0,
        previous: 0,
      };
    });
    reactionsByMonth.unshift(item);
    tagsArr.push({
      x: format(month, 'MMM'),
      y: 0,
    });
  });
  // Set TagId as object keys
  const tagsByMonth = createTags(tagsArr);
  let {
    reactions,
    tags,
  } = parseTagsAndReactions(
    smartcomments,
    'MMM',
    reactionsByMonth,
    tagsByMonth,
    startDate,
    endDate,
  );
  reactions = mergeTwoData(reactions, 'm');
  tags = reduceTagsData(tags, 'm');
  return {
    reactionsByMonth: reactions,
    tagsByMonth: tags,
  };
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
    const {
      reactionsByDay,
      tagsByDay,
    } = generateChartDataByDays(
      smartComments,
      dateDiff,
      startDate,
      endDate,
    );
    return {
      reactionsChartData: reactionsByDay,
      tagsChartData: tagsByDay,
    };
  case 'week':
    const {
      reactionsByWeek,
      tagsByWeek,
    } = generateChartDataByWeeks(
      smartComments,
      startDate,
      endDate,
    );
    return {
      reactionsChartData: reactionsByWeek,
      tagsChartData: tagsByWeek,
    };
  case 'month':
    const {
      reactionsByMonth,
      tagsByMonth,
    } = generateChartDataByMonths(
      smartComments,
      startDate,
      endDate,
    );
    return {
      reactionsChartData: reactionsByMonth,
      tagsChartData: tagsByMonth,
    };
  case 'year':
    const {
      reactionsByYear,
      tagsByYear,
    } = generateChartDataByYears(
      smartComments,
      startDate,
      endDate,
    );
    return {
      reactionsChartData: reactionsByYear,
      tagsChartData: tagsByYear,
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

export const setSmartCommentsDateRange = (
  smartComments,
  startDate,
  endDate
) => {
  let startDay =
    smartComments[smartComments.length - 1]?.source.createdAt ||
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
