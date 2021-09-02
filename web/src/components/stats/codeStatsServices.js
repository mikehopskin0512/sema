import { 
  format,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  differenceInCalendarDays,
  subDays,
  subMonths,
  endOfWeek,
  isWithinInterval
} from 'date-fns';
import { findIndex } from 'lodash';
import { ReactionList } from '../../data/activity';

export const generateDays = (smartcomments, diff, endDate) => {
  let reactionsArr = [];
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
    reactionsArr.push(item);
    day += 1;
  }
  // Add count to matching smart comment reaction with the same day
  smartcomments.forEach((comment) => {
    const itemDate =  new Date(comment.createdAt);
    const dateIndex = findIndex(reactionsArr, { date: format(itemDate, 'MM/dd') })
    if (dateIndex > -1) {
      reactionsArr[dateIndex][comment.reaction] += 1;
    }
  });
  return reactionsArr;
}

export const generateWeeks = (smartcomments, startDate, endDate) => {
  const weeks = eachWeekOfInterval({
    start: new Date(startDate),
    end: new Date(endDate)
  });
  let reactionsArr = [];
  const weekRange = weeks.map((week) => {
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
    reactionsArr.unshift(item);
    return {
      date: `${startWeekDay}-${endWeekDay}`,
      startDay,
      endDay
    };
  });
  // Add count to matching smart comment reaction with the same day
  smartcomments.forEach((comment) => {
    const itemRange =  findIndex(weekRange, (item) => (isWithinInterval(new Date(comment.createdAt), {
      start: item.startDay,
      end: item.endDay,
    })));
    const dateIndex = findIndex(reactionsArr, { date: weekRange[itemRange].date })
    if (dateIndex > -1) {
      reactionsArr[dateIndex][comment.reaction] += 1;
    }
  });
  return reactionsArr;
}

export const generateMonths = (smartcomments, startDate, endDate) => {
  const months = eachMonthOfInterval({
    start: new Date(startDate),
    end: new Date(endDate)
  });
  let reactionsArr = [];
  months.forEach((date) => {
    const month = new Date(date);
    const item = {
      date: format(month, 'MMM'),
    };
    ReactionList.forEach((reaction) => {
      item[reaction.value] = 0;
    });
    reactionsArr.unshift(item);
  });
  // Add count to matching smart comment reaction with the same day
  smartcomments.forEach((comment) => {
    const month =  format(new Date(comment.createdAt), 'MMM');
    const dateIndex = findIndex(reactionsArr, { date: month });
    if (dateIndex > -1) {
      reactionsArr[dateIndex][comment.reaction] += 1;
    }
  });
  return reactionsArr;
}

export const generateYears = (smartcomments, startDate, endDate) => {
  const years = eachYearOfInterval({
    start: new Date(startDate),
    end: new Date(endDate)
  });
  let reactionsArr = [];
  years.forEach((date) => {
    const month = new Date(date);
    const item = {
      date: format(month, 'yyyy'),
    };
    ReactionList.forEach((reaction) => {
      item[reaction.value] = 0;
    });
    reactionsArr.unshift(item);
  });
  // Add count to matching smart comment reaction with the same day
  smartcomments.forEach((comment) => {
    const year =  format(new Date(comment.createdAt), 'yyyy');
    const dateIndex = findIndex(reactionsArr, { date: year });
    if (dateIndex > -1) {
      reactionsArr[dateIndex][comment.reaction] += 1;
    }
  });
  return reactionsArr;
}