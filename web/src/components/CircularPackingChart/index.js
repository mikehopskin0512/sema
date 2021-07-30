import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import { ResponsiveCirclePacking } from '@nivo/circle-packing';
import { TAGS } from '../../utils/constants';

const CircularPacking = ({ data }) => {
  const parseData = (rawData) => {
    let children = [];
    if (rawData) {
      const keys = Object.keys(rawData);
      children = keys.map((_id) => {
        const tag = find(TAGS, { _id });
        return {
          name: tag.label,
          id: _id,
          color: tag.isPositive ? '#A4E799' : '#E79999',
          value: rawData[_id],
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

  // TODO: Tooltip - needs data for the line chart
  // Y - # of Reactions
  // X - Date

  return (
    <>
      <ResponsiveCirclePacking
        data={parseData(data)}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        id="name"
        value="value"
        colors={(item) => item.data.color}
        childColor={{ from: 'color', modifiers: [['brighter', 0.4]] }}
        padding={4}
        enableLabels
        leavesOnly
        labelsSkipRadius={10}
        labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.5]] }}
        fill={[{ match: { depth: 1 }, id: 'lines' }]}
        // tooltip={({ id, value, color }) => (
        //   <strong style={{ color }}>
        //     {id}: {value}
        //   </strong>
        // )}
      />
    </>
  );
};

CircularPacking.propTypes = {
  data: PropTypes.object.isRequired,
};

export default CircularPacking;
