import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import DateRangeSelector from '../dateRangeSelector';
import ReactionChart from './reactionChart';
import TagsChart from './tagsChart';
import { setSmartCommentsDateRange, getReactionTagsChartData } from '../../utils/parsing'

const StatsPage = ({ startDate, endDate, onDateChange }) => {
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
        <div>
          <DateRangeSelector
            start={startDate}
            end={endDate}
            onChange={onDateChange}
            isRight
            buttonProps={{
              placeholder: 'Select Dates',
            }}
          />
        </div>
      </div>
      {startDate && endDate && (
        <p className="px-10 mt-10 has-text-primary">Showing data from <b>{format(new Date(startDate), 'MMMM dd, yyyy')}</b> to <b>{format(new Date(endDate), 'MMMM dd, yyyy')}</b></p>
      )}
      <div className="is-flex is-flex-wrap-wrap mt-10">
        <ReactionChart reactions={reactions} />
        <TagsChart tags={tags} />
      </div>
    </>
  );
};

export default StatsPage;
