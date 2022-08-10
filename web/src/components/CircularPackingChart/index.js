import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveCirclePacking } from '@nivo/circle-packing';
import NoChartData from '../noChartData';

const CircularPacking = ({ circlePackingData, emptyChart, renderTooltip }) => {
  if (emptyChart) {
    return (
      <NoChartData />
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
  circlePackingData: PropTypes.object.isRequired,
  emptyChart: PropTypes.bool.isRequired,
  renderTooltip: PropTypes.element.isRequired
};

export default CircularPacking;
