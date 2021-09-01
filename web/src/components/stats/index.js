import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { findIndex } from 'lodash';
import { format, isBefore, isSameDay, subDays } from 'date-fns';
import clsx from 'clsx';
import styles from './stats.module.scss';
import BarChart from '../BarChart';
import CircularPacking from '../CircularPackingChart';

import { ReactionList, TagList } from '../../data/activity';

const StatsPage = () => {
  const { repositories } = useSelector((state) => ({
    repositories: state.repositoriesState,
  }));

  const [reactions, setReactions] = useState([]);
  const [tags, setTags] = useState({});

  const getReactionOverview = (smartcomments) => {
    let reactionsArr = [];
    let day = 0;
    // Create Array of data for the BarChart
    while (day < 7) {
      const thisDay = subDays(new Date(), day);
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
      const within7Days = isBefore(subDays(new Date(), 7), itemDate);
      if (within7Days) {
        const dateIndex = findIndex(reactionsArr, { date: format(itemDate, 'MM/dd') })
        if (dateIndex > -1) {
          reactionsArr[dateIndex][comment.reaction] += 1;
        }
      }
    });
    setReactions(reactionsArr);
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
            <p className="has-text-deep-black has-text-weight-semibold">Reactions (Last 7 Days)</p>
            <BarChart data={reactions} />
          </div>
        </div>
        <div className={clsx('is-flex-grow-1 px-10 mb-20', styles.containers)}>
          <div className={clsx('has-background-white border-radius-2px p-15', styles.shadow)}>
            <p className="has-text-deep-black has-text-weight-semibold">Tags (All Time)</p>
            <CircularPacking data={tags} />
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsPage;
