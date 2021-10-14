import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-regular-svg-icons';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { find, isEmpty, round } from 'lodash';
import { ResponsiveCirclePacking } from '@nivo/circle-packing';
import styles from './circularPackingChart.module.scss';
import LineChart from '../LineChart';
import { TAGS } from '../../utils/constants';

const CircularPacking = ({ data, groupBy = '' }) => {
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
            color: tag.isPositive ? '#BBC5AA' : '#AFADAA',
            value: rawData[_id].total,
            data: rawData[_id].data || [],
          };
        }
        return {
          isPositive: false,
          name: '',
          id: _id,
          color: '#AFADAA',
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

  const renderTooltip = React.memo(({ formattedValue, value, data }) => (
      <div className="box has-background-white p-20 border-radius-4px">
        <p className="has-text-weight-semibold">Readable - last {data.data.length} {groupBy}s</p>
        { data.data.length > 0 && (
          <div className={clsx('py-5', styles['line-chart-container'])}>
            <LineChart data={[data]}  />
          </div>
        ) }
        <p className="is-size-7">{value} comments</p>
        <p className="is-size-7">{formattedValue} of all tags</p>
      </div>
    )
  );

  if (noData) {
    return (
      <div className="is-flex is-flex-direction-column is-justify-content-center is-full-height is-align-items-center is-flex-wrap-wrap">
        <FontAwesomeIcon icon={faChartBar} size="3x" />
        <p className="is-size-5">No Tags</p>
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
};

export default CircularPacking;
