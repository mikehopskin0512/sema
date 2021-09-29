import { 
  format,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  subDays,
  endOfWeek,
  isWithinInterval,
} from 'date-fns';
import { findIndex } from 'lodash';
import { ReactionList, TagList } from '../../data/activity';

export const generateArraysByDays = (smartcomments, diff, endDate) => {
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
    ReactionList.forEach((reaction) => {
      item[reaction.value] = 0;
    });
    reactionsByDay.push(item);
    tagsArr.push({
        x: format(thisDay, 'MM/dd'),
        y: 0,
    });
    day += 1;
  }
  // Set TagId as object keys
  let tagsByDay = {};
  TagList.forEach((tag) => {
    tagsByDay[tag.value] = {
      total: 0,
      data: [...tagsArr],
    };
  });
  // Add count to matching smart comment reaction with the same day
  smartcomments.forEach((comment) => {
    const itemDate =  new Date(comment.createdAt);
    const reactionsIndex = findIndex(reactionsByDay, { date: format(itemDate, 'MM/dd') });
    if (reactionsIndex > -1) {
      reactionsByDay[reactionsIndex][comment.reaction] += 1;
    }
    comment.tags.forEach((tag) => {
      const tagsIndex = findIndex(tagsByDay[tag._id].data, { x: format(itemDate, 'MM/dd') });
      if (tagsIndex > -1) {
        tagsByDay[tag._id].total += 1;
        const tagData = tagsByDay[tag._id].data[tagsIndex];
        tagsByDay[tag._id].data[tagsIndex] = {
          ...tagData,
          y: tagData.y + 1,
        };
      }
    })
  });
  return { reactionsByDay, tagsByDay };
}

export const generateArraysByWeeks = (smartcomments, startDate, endDate) => {
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
    ReactionList.forEach((reaction) => {
      item[reaction.value] = 0;
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
  // Set TagId as object keys
  let tagsByWeek = {};
  TagList.forEach((tag) => {
    tagsByWeek[tag.value] = {
      total: 0,
      data: [...tagsArr],
    };
  });
  // Add count to matching smart comment reaction with the same day
  smartcomments.forEach((comment) => {
    const itemRange =  findIndex(weekRange, (item) => (isWithinInterval(new Date(comment.createdAt), {
      start: item.startDay,
      end: item.endDay,
    })));
    const reactionIndex = findIndex(reactionsByWeek, { date: weekRange[itemRange]?.date })
    if (reactionIndex > -1) {
      reactionsByWeek[reactionIndex][comment.reaction] += 1;
    }
    comment.tags.forEach((tag) => {
      const tagsIndex = findIndex(tagsByWeek[tag._id].data, { date: weekRange[itemRange]?.date });
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
  return { reactionsByWeek, tagsByWeek };
}

export const generateArraysByMonths = (smartcomments, startDate, endDate) => {
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
    ReactionList.forEach((reaction) => {
      item[reaction.value] = 0;
    });
    reactionsByMonth.unshift(item);
    tagsArr.push({
      x: format(month, 'MMM'),
      y: 0,
    });
  });
  // Set TagId as object keys
  let tagsByMonth = {};
  TagList.forEach((tag) => {
    tagsByMonth[tag.value] = {
      total: 0,
      data: [...tagsArr],
    };
  });
  // Add count to matching smart comment reaction with the same day
  smartcomments.forEach((comment) => {
    const month =  format(new Date(comment.createdAt), 'MMM');
    const reactionIndex = findIndex(reactionsByMonth, { date: month });
    if (reactionIndex > -1) {
      reactionsByMonth[reactionIndex][comment.reaction] += 1;
    }
    comment.tags.forEach((tag) => {
      const tagsIndex = findIndex(tagsByMonth[tag._id].data, { x: month });
      if (tagsIndex > -1) {
        tagsByMonth[tag._id].total += 1;
        const tagData = tagsByMonth[tag._id].data[tagsIndex];
        tagsByMonth[tag._id].data[tagsIndex] = {
          ...tagData,
          y: tagData.y + 1,
        };
      }
    })
  });
  return { reactionsByMonth, tagsByMonth };
}

export const generateArraysByYears = (smartcomments, startDate, endDate) => {
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
    ReactionList.forEach((reaction) => {
      item[reaction.value] = 0;
    });
    reactionsByYear.unshift(item);
    tagsArr.push({
      x: format(month, 'yyyy'),
      y: 0,
    });
  });
  // Set TagId as object keys
  let tagsByYear = {};
  TagList.forEach((tag) => {
    tagsByYear[tag.value] = {
      total: 0,
      data: [...tagsArr],
    };
  });
  // Add count to matching smart comment reaction with the same day
  smartcomments.forEach((comment) => {
    const year =  format(new Date(comment.createdAt), 'yyyy');
    const reactionIndex = findIndex(reactionsByYear, { date: year });
    if (reactionIndex > -1) {
      reactionsByYear[reactionIndex][comment.reaction] += 1;
    }
    comment.tags.forEach((tag) => {
      const tagsIndex = findIndex(tagsByYear.data, { x: year });
      if (tagsIndex > -1) {
        tagsByYear[tag._id].total += 1;
        const tagData = tagsByYear[tag._id].data[tagsIndex];
        tagsByYear[tag._id].data[tagsIndex] = {
          ...tagData,
          y: tagData.y + 1,
        };
      }
    });
  });
  return { reactionsByYear, tagsByYear };
}
