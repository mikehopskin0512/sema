import React from 'react';
import PropTypes from 'prop-types';
import { find, round } from 'lodash';
import { ResponsiveCirclePacking } from '@nivo/circle-packing';
import { TAGS } from '../../utils/constants';

const CircularPacking = ({ data }) => {
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
          };
        }
        return {
          isPositive: false,
          name: '',
          id: _id,
          color: '#AFADAA',
          value: 0,
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

  const renderTooltip = ({ percentage }) => (
    <div className="box has-background-white px-20 py-5 border-radius-4px">
      <p className="has-text-weight-semibold">{round(percentage)}%</p>
    </div>
  );

  return (
    <>
      <ResponsiveCirclePacking
        data={parseData(data)}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        id="name"
        value="value"
        colors={(item) => item.data.color}
        padding={4}
        enableLabels
        leavesOnly
        labelsSkipRadius={3}
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
};

export default CircularPacking;
