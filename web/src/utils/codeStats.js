import { 
  format,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  subDays,
  endOfWeek,
  isWithinInterval,
  addWeeks,
  addMonths,
  addYears,
  startOfWeek,
} from 'date-fns';
import { findIndex } from 'lodash';
import { EMOJIS, TAGS } from './constants';

export const generateChartDataByDays = (smartcomments, diff, startDate, endDate) => {
  let reactionsByDay = [];
  const tagsArr = [];
  let day = 0;
  const countedDays = diff + 1;
  // Create Array of data for the BarChart
  while (day < countedDays) {
    const thisDay = subDays(new Date(endDate), day);
    const item = {
      date: format(thisDay, 'MM/dd')
    };
    // Set Reaction Ids as object keys
    EMOJIS.forEach((reaction) => {
      item[reaction._id] = {
        current: 0,
        previous: 0
      };
    });
    reactionsByDay.push(item);
    tagsArr.push({
        x: format(thisDay, 'MM/dd'),
        y: 0,
    });
    day += 1;
  }
  const tagsByDay = createTags(tagsArr);
  const {
    reactions,
    tags
  } = parseTagsAndReactions(
    smartcomments,
    "MM/dd",
    reactionsByDay,
    tagsByDay,
    startDate,
    endDate,
  );
  return { reactionsByDay: reactions, tagsByDay: tags };
}

export const generateChartDataByWeeks = (smartcomments, startDate, endDate) => {
  const weeks = eachWeekOfInterval({
    start: new Date(startDate),
    end: new Date(endDate)
  });
  let reactionsByWeek = [];
  const tagsArr = [];
  const weekRange = weeks.map((week, index) => {
    const startDay = new Date(week);
    const endDay = endOfWeek(new Date(week));
    const startWeekDay = format(startDay, 'MM/dd');
    const endWeekDay = format(endDay, 'MM/dd');
    const item = {
      date: `${startWeekDay}-${endWeekDay}`,
    };
    EMOJIS.forEach((reaction) => {
      item[reaction._id] = {
        current: 0,
        previous: 0
      };
    });
    reactionsByWeek.unshift(item);
    tagsArr.push({
      date: `${startWeekDay}-${endWeekDay}`,
      x: `Week ${index + 1}`,
      y: 0,
    });
    return {
      date: `${startWeekDay}-${endWeekDay}`,
      startDay,
      endDay
    };
  });
  const tagsByWeek = createTags(tagsArr);
  // Separate comments within and outside the date range
  const filteredComments = smartcomments.filter((comment) => isWithinInterval(
    new Date(comment.createdAt),
    {
      start: new Date(startDate),
      end: new Date(endDate)
    }
  ));
  const outOfRangeComments = smartcomments.filter((comment) => !isWithinInterval(
    new Date(comment.createdAt),
    {
      start: new Date(startDate),
      end: new Date(endDate)
    }
  ));
  // Count reactions and tags within time range
  filteredComments.forEach((comment) => {
    const itemRange =  findIndex(weekRange, (item) => (isWithinInterval(new Date(comment.createdAt), {
      start: item.startDay,
      end: item.endDay,
    })));
    const reactionIndex = findIndex(reactionsByWeek, { date: weekRange[itemRange]?.date })
    if (reactionIndex > -1) {
      reactionsByWeek[reactionIndex][comment.reaction].current += 1;
    }
    comment.tags.forEach((tag) => {
      const tagsIndex = findIndex(tagsByWeek[tag._id]?.data, { date: weekRange[itemRange]?.date });
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
    const dayAfterAMonth = addMonths(new Date(comment.createdAt), 1);
    const startWeek = format(startOfWeek(new Date(dayAfterAMonth)), 'MM/dd');
    const endWeek = format(endOfWeek(new Date(dayAfterAMonth)), 'MM/dd');
    const index = findIndex(reactionsByWeek, { date: `${startWeek}-${endWeek}` });
    if (index > -1) {
      reactionsByWeek[index][comment.reaction].previous += 1;
    }
  });
  return { reactionsByWeek, tagsByWeek };
}

export const generateChartDataByMonths = (smartcomments, startDate, endDate) => {
  const months = eachMonthOfInterval({
    start: new Date(startDate),
    end: new Date(endDate)
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
        previous: 0
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
  const {
    reactions,
    tags
  } = parseTagsAndReactions(
    smartcomments,
    "MMM",
    reactionsByMonth,
    tagsByMonth,
    startDate,
    endDate,
  )
  return { reactionsByMonth: reactions, tagsByMonth: tags };
}

export const generateChartDataByYears = (smartcomments, startDate, endDate) => {
  const years = eachYearOfInterval({
    start: new Date(startDate),
    end: new Date(endDate)
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
    tags
  } = parseTagsAndReactions(
    smartcomments,
    "yyyy",
    reactionsByYear,
    tagsByYear,
    startDate,
    endDate,
  )
  return { reactionsByYear: reactions, tagsByYear: tags };
}

export const getTotalReactionsOfComments = (smartComments = []) => {
  return smartComments
    .filter((comment) => comment.reaction)
    .reduce((acc, comment) => {
      const { reaction } = comment;
      if (acc?.[reaction]) {
        acc[reaction]++
      } else {
        acc[reaction] = 1;
      }
      return acc
    }, {});
};

export const getTotalTagsOfComments = (smartComments = []) => {
  return smartComments
    .filter((comment) => comment?.tags?.length)
    .reduce((acc, comment) => {
      const { tags } = comment;
      const total = tags.reduce((acc, tag) => {
        const { _id: tagId } = tag;
        if (acc?.[tagId]) {
          acc[tagId]++
        } else {
          acc[tagId] = 1
        }
        return acc;
      }, {})
      for (const [key, val] of Object.entries(total)) {
        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += val
      }
      return acc
    }, {})
};

const createTags = (tagsArr) => {
  let tags = {};
  TAGS.forEach((tag) => {
    tags[tag._id] = {
      total: 0,
      data: [...tagsArr],
    };
  });
  return tags;
}

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
  const filteredComments = smartComments.filter((comment) => isWithinInterval(
    new Date(comment.createdAt),
    {
      start: new Date(startDate),
      end: new Date(endDate)
    }
  ));
  const outOfRangeComments = smartComments.filter((comment) => !isWithinInterval(
    new Date(comment.createdAt),
    {
      start: new Date(startDate),
      end: new Date(endDate)
    }
  ));
  // Count reactions and tags within the time range
  filteredComments.forEach((comment) => {
    const formattedDate =  format(new Date(comment.createdAt), dateFormat);
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
    })
  });
  // Count reactions and tags outside the time range
  outOfRangeComments.forEach((comment) => {
    let formatDate;
    let index;
    switch (dateFormat) {
      case 'MM/dd':
        formatDate = format(addWeeks(new Date(comment.createdAt), 1), dateFormat);
        index = findIndex(reactionsArr, { date: formatDate });
        if (index > -1) {
          reactionsArr[index][comment.reaction].previous += 1;
        }
        return;
      case 'MMM':
        formatDate = format(addYears(new Date(comment.createdAt), 1), dateFormat);
        index = findIndex(reactionsArr, { date: formatDate });
        if (index > -1) {
          reactionsArr[index][comment.reaction].previous += 1;
        }
        return;
      case 'yyyy':
        formatDate = format(addYears(new Date(comment.createdAt), 10), dateFormat);
        index = findIndex(reactionsArr, { date: formatDate });
        if (index > -1) {
          reactionsArr[index][comment.reaction].previous += 1;
        }
        return;
      default:
        return;
    }
  });
  return { reactions: reactionsArr, tags };
}
