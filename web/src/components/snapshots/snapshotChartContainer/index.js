import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getReactionTagsChartData } from '../../../utils/parsing';
import ReactionChart from '../../stats/reactionChart';
import TagsChart from '../../stats/tagsChart';
import ReactionLineChart from '../../stats/reactionLineChart';

const SnapshotChartContainer = ({
  chartType, smartComments, startDate, endDate, groupBy, dateDiff, yAxisType,
}) => {
  const [reactions, setReactions] = useState([]);
  const [tags, setTags] = useState({});

  useEffect(() => {
    if (startDate && endDate && groupBy) {
      const { reactionsChartData, tagsChartData } = getReactionTagsChartData({
        startDate,
        endDate,
        groupBy,
        smartComments,
        dateDiff,
      });
      setReactions(reactionsChartData);
      setTags(tagsChartData);
    }
  }, [startDate, endDate, groupBy, smartComments, dateDiff]);

  const renderChart = (type) => {
    switch (type) {
    case 'reactions-area':
      return <ReactionLineChart reactions={reactions} groupBy={groupBy} isSnapshot />;
    case 'reactions':
      return <ReactionChart reactions={reactions} yAxisType={yAxisType} groupBy={groupBy} isSnapshot />;
    case 'tags':
      return <TagsChart tags={tags} groupBy={groupBy} isSnapshot />;
    default:
      return '';
    }
  };

  return (
    <>
      {renderChart(chartType)}
    </>
  );
};

SnapshotChartContainer.defaultProps = {
  yAxisType: '',
};

SnapshotChartContainer.propTypes = {
  chartType: PropTypes.string.isRequired,
  smartComments: PropTypes.array.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  groupBy: PropTypes.string.isRequired,
  dateDiff: PropTypes.number.isRequired,
  yAxisType: PropTypes.string,
};

export default SnapshotChartContainer;
