import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { find, isEmpty, round } from 'lodash';
import { ResponsiveCirclePacking } from '@nivo/circle-packing';
import styles from './circularPackingChart.module.scss';
import LineChart from '../LineChart';
import { TAGS, CIRCULAR_PACKING_COLORS } from '../../utils/constants';
import { CodeIcon } from '../Icons';

const CircularPacking = ({ data, groupBy = 'week', tagBy = '' }) => {
  const [circlePackingData, setCirclePackingData] = useState({
    children: [],
  });
  const [noData, setNoData] = useState(false);

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
      color: '#FFF',
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

  const renderTooltip = React.memo(({ formattedValue, value, data: tag }) => (
    <div className="box has-background-black-900 p-20 border-radius-4px">
      <p className="has-text-weight-semibold is-size-7 has-text-white-50">{tag.name} - last {tag.data.length} {groupBy}{tag.data.length > 1 && 's'}</p>
      {tag.data.length > 0 && (
        <div className={clsx('py-3', styles['line-chart-container'])}>
          <LineChart data={[tag]} />
        </div>
      )}
      <p className="is-size-7 has-text-white-50">{value} comments</p>
      <p className="is-size-7 has-text-white-50">{formattedValue} of all tags {tagBy}</p>
    </div>
  ))

  if (noData) {
    return (
      <div className="is-flex is-flex-direction-column is-justify-content-center is-full-height is-align-items-center is-flex-wrap-wrap">
        <CodeIcon size="large" />
        <p className="is-size-5 ">No Tags</p>
      </div>
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
