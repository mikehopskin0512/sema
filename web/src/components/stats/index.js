import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { subDays, differenceInCalendarDays } from 'date-fns';
import clsx from 'clsx';
import { generateArraysByDays, generateArraysByWeeks, generateArraysByMonths, generateArraysByYears } from './codeStatsServices';
import styles from './stats.module.scss';
import ReactionChart from './reactionChart';
import TagsChart from './tagsChart';

const dayInWeek = 7;
const dayInMonth = 30;
const dayInYear = 365;

const StatsPage = ({ startDate, endDate }) => {
  const { repositories } = useSelector((state) => ({
    repositories: state.repositoriesState,
  }));

  const { data: { overview } } = repositories;

  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [dateDiff, setDateDiff] = useState();
  const [reactions, setReactions] = useState([]);
  const [tags, setTags] = useState({});
  const [groupBy, setGroupBy] = useState('');

  const setDates = (smartcomments) => {
    let startDay = smartcomments[smartcomments.length - 1]?.createdAt || subDays(new Date(), 6);
    let endDay = new Date();
    if (startDate && endDate) {
      startDay = startDate;
      endDay = endDate;
    }
    const diff = differenceInCalendarDays(new Date(endDay), new Date(startDay));
    setStart(startDay);
    setEnd(endDay);
    setDateDiff(diff);
    if (diff < dayInWeek + 1) {
      setGroupBy('day');
    }
    if (diff < dayInMonth && diff >= dayInWeek) {
      setGroupBy('week');
    }

    if (diff < dayInYear && diff >= dayInMonth) {
      setGroupBy('month');
    }

    if (diff >= dayInYear) {
      setGroupBy('year');
    } 
  };

  useEffect(() => {
    if (overview?.smartcomments && overview?.smartcomments.length > 0) {
      setDates(overview.smartcomments);
    }
  }, [repositories]);

  useEffect(() => {
    if (start && end && dateDiff && groupBy) {
      const { smartcomments } = overview;
      // GENERATE REACTIONS AND TAGS
      switch (groupBy) {
        case 'day':
          const { reactionsByDay, tagsByDay } = generateArraysByDays(smartcomments, dateDiff, end);
          setReactions(reactionsByDay);
          setTags(tagsByDay);
          return;
        case 'week':
          const { reactionsByWeek, tagsByWeek } = generateArraysByWeeks(smartcomments, start, end);
          setReactions(reactionsByWeek);
          setTags(tagsByWeek);
          return;
        case 'month':
          const { reactionsByMonth, tagsByMonth } = generateArraysByMonths(smartcomments, start, end);
          setReactions(reactionsByMonth);
          setTags(tagsByMonth);
          return;
        case 'year':
          const { reactionsByYear, tagsByYear } = generateArraysByYears(smartcomments, start, end);
          setReactions(reactionsByYear);
          setTags(tagsByYear);
          return;
        default:
          return;
      }
    }
  }, [start, end, groupBy]);

  return(
    <>
      <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap px-10">
        <p className="has-text-deep-black has-text-weight-semibold is-size-4">Repo Stats</p>
      </div>
      <div className="is-flex is-flex-wrap-wrap mt-20">
        <ReactionChart reactions={reactions} />
        <TagsChart tags={tags} />
        {/* <div className={clsx('is-flex-grow-1 px-10 mb-20', styles.containers)}>
          <div className={clsx('has-background-white border-radius-2px p-15', styles.shadow)}>
            <p className="has-text-deep-black has-text-weight-semibold">Reactions</p>
            <BarChart data={reactions} groupBy={groupBy} />
          </div>
        </div>
        <div className={clsx('is-flex-grow-1 px-10 mb-20', styles.containers)}>
          <div className={clsx('has-background-white border-radius-2px p-15', styles.shadow)}>
            <p className="has-text-deep-black has-text-weight-semibold">Tags</p>
            <CircularPacking data={tags} groupBy={groupBy} />
          </div>
        </div> */}
      </div>
    </>
  );
};

export default StatsPage;
