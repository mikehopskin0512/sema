import React, { useEffect, useState } from 'react';
import { find, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { ResponsiveCirclePacking } from '@nivo/circle-packing';
import { TooltipWrapper } from '@nivo/tooltip';
import NoChartData from '../noChartData';
import styles from './circularPackingChart.module.scss';
import LineChart from '../LineChart';
import { TAGS, CIRCULAR_PACKING_COLORS } from '../../utils/constants';
import { white0 } from '../../../styles/_colors.module.scss';

const CircularPacking = ({ data, groupBy = 'week', tagBy = '', tooltipPosition }) => {
  const [circlePackingData, setCirclePackingData] = useState({
    children: [],
  });
  const [noData, setNoData] = useState(false);
  const [customTooltipPosition, setCustomTooltipPosition] = useState("top");

  const parseData = (rawData) => {
    let children = [];
    if (rawData) {
      const keys = Object.keys(rawData);
      children = keys.map((_id) => {
        const tag = find(TAGS, { _id });
        if (tag) {
          return {
            isPositive: tag.isPositive,
            name: tag.label,
            id: _id,
            color: tag.isPositive ? CIRCULAR_PACKING_COLORS.POSITIVE : CIRCULAR_PACKING_COLORS.NEGATIVE,
            value: rawData[_id].total,
            data: rawData[_id].data || [],
          };
        }
        return {
          isPositive: false,
          name: '',
          id: _id,
          color: CIRCULAR_PACKING_COLORS.NEGATIVE,
          value: 0,
          data: [],
        };
      });
    }
    const chartData = {
      name: 'Tags',
      color: white0,
      children,
    };
    return chartData;
  };

  const getTotalTags = () => {
    let total = 0;
    const keys = Object.keys(data);
    keys.forEach((key) => {
      total += data[key].total;
    })
    return total;
  }

  useEffect(() => {
    const total = getTotalTags();
    if (!isEmpty(data) && total > 0) {
      const parsedData = parseData(data);
      setCirclePackingData(parsedData);
      setNoData(false);
    } else {
      setNoData(true);
    }
  }, [data]);

  useEffect(() => {
    setCustomTooltipPosition(tooltipPosition);
  }, [tooltipPosition]);

  const renderTooltip = React.memo(({ formattedValue, value, data: tag }) => (
    <TooltipWrapper anchor={tooltipPosition} position={[0, 0]}>
      <div className={clsx("box has-background-black-900 p-20 border-radius-4px", styles.tooltip)}>
        <p className="has-text-weight-semibold is-size-7 has-text-white-50">{tag.name} - last {tag.data.length} {groupBy}{tag.data.length > 1 && 's'}</p>
        {tag.data.length > 0 && (
          <div className={clsx('py-3', styles['line-chart-container'])}>
            <LineChart data={[tag]} />
          </div>
        )}
        <p className="is-size-7 has-text-white-50">{value} comments</p>
        <p className="is-size-7 has-text-white-50">{formattedValue} of all tags {tagBy}</p>
      </div>
    </TooltipWrapper>
  ))

  if (noData) {
    return (
      <NoChartData type="Tags" />
    );
  }

  return (
    <>
      <ResponsiveCirclePacking
        data={circlePackingData}
        margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
        id="name"
        value="value"
        colors={(item) => item.data.color}
        padding={4}
        enableLabels
        leavesOnly
        labelsSkipRadius={10}
        labelTextColor={{ from: 'color', modifiers: [['darker', 5]] }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
        fill={[{ match: { depth: 1 }, id: 'lines' }]}
        tooltip={renderTooltip}
      />
    </>
  );
};

CircularPacking.propTypes = {
  data: PropTypes.object.isRequired,
  groupBy: PropTypes.string.isRequired,
  tagBy: PropTypes.string.isRequired,
};

export default CircularPacking;
