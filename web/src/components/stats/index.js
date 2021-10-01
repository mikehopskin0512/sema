import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReactionChart from './reactionChart';
import TagsChart from './tagsChart';
import { setSmartCommentsDateRange, getReactionTagsChartData } from '../../utils/parsing'

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

  useEffect(() => {
    if (overview?.smartcomments && overview?.smartcomments.length > 0) {
      const dates = setSmartCommentsDateRange(overview.smartcomments, startDate, endDate);
      const { startDay, endDay, dateDiff, groupBy } = dates;
      setStart(startDay);
      setEnd(endDay);
      setDateDiff(dateDiff);
      setGroupBy(groupBy);
    }
  }, [repositories]);

  useEffect(() => {
    if (start && end && dateDiff && groupBy) {
      const { smartcomments } = overview;
      const { reactionsChartData, tagsChartData } = getReactionTagsChartData({
        startDate: start,
        endDate: end,
        groupBy: groupBy,
        smartComments: smartcomments,
        dateDiff,
      });
      setReactions(reactionsChartData);
      setTags(tagsChartData);
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
