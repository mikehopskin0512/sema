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
  const [dateDiff, setDateDiff] = useState(0);
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
    if (start && end && groupBy) {
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
      <div className="is-flex is-flex-wrap-wrap mt-10">
        <ReactionChart reactions={reactions} groupBy={groupBy} />
        <TagsChart tags={tags} groupBy={groupBy} />
      </div>
    </>
  );
};

export default StatsPage;
