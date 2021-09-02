import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { subDays, differenceInCalendarDays } from 'date-fns';
import clsx from 'clsx';
import { generateAll, generateDays, generateWeeks, generateMonths, generateYears } from './codeStatsServices';
import styles from './stats.module.scss';
import BarChart from '../BarChart';
import CircularPacking from '../CircularPackingChart';

import { TagList } from '../../data/activity';

const dayInWeek = 7;
const dayInMonth = 30;
const dayInYear = 365;

const StatsPage = ({ startDate, endDate }) => {
  const { repositories } = useSelector((state) => ({
    repositories: state.repositoriesState,
  }));

  const [reactions, setReactions] = useState([]);
  const [initial, setInitial] = useState(true);
  const [tags, setTags] = useState({});

  const getReactionOverview = (smartcomments) => {
    if (smartcomments.length > 0) {
      let start = smartcomments[smartcomments.length - 1]?.createdAt || subDays(new Date(), 6);
      let end = new Date();
      if (startDate && endDate) {
        start = startDate;
        end = endDate;
      }
      const diff = differenceInCalendarDays(new Date(end), new Date(start));
      if (diff < dayInWeek + 1) {
        const reactionsArr = generateDays(smartcomments, diff, end);
        setReactions(reactionsArr);
      }

      if (diff < dayInMonth && diff >= dayInWeek) {
        const reactionsArr = generateWeeks(smartcomments, start, end);
        setReactions(reactionsArr);
      }

      if (diff < dayInYear && diff >= dayInMonth) {
        const reactionsArr = generateMonths(smartcomments, start, end);
        setReactions(reactionsArr);
      }

      if (diff >= dayInYear) {
        const reactionsArr = generateYears(smartcomments, start, end);
        setReactions(reactionsArr);
      } 
    }
  }

  const getTagsOverview = (smartcomments) => {
    let tagObject = {};
    // Set TagId as object keys
    TagList.forEach((tag) => {
      tagObject[tag.value] = {
        total: 0
      };
    });
    // Add count to matching smart comment tag
    smartcomments.forEach((comment) => {
      comment.tags.forEach((tag) => {
        tagObject[tag._id].total += 1;
      })
    });
    setTags(tagObject)
  }

  useEffect(() => {
    if (repositories?.data?.overview) {
      const { overview: { smartcomments = [] } } = repositories.data;
      getReactionOverview(smartcomments);
      getTagsOverview(smartcomments);
    }
  }, [repositories]);

  return(
    <>
      <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap px-10">
        <p className="has-text-deep-black has-text-weight-semibold is-size-4">Repo Stats</p>
      </div>
      <div className="is-flex is-flex-wrap-wrap mt-20">
        <div className={clsx('is-flex-grow-1 px-10 mb-20', styles.containers)}>
          <div className={clsx('has-background-white border-radius-2px p-15', styles.shadow)}>
            <p className="has-text-deep-black has-text-weight-semibold">Reactions</p>
            <BarChart data={reactions} />
          </div>
        </div>
        <div className={clsx('is-flex-grow-1 px-10 mb-20', styles.containers)}>
          <div className={clsx('has-background-white border-radius-2px p-15', styles.shadow)}>
            <p className="has-text-deep-black has-text-weight-semibold">Tags</p>
            <CircularPacking data={tags} />
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsPage;
