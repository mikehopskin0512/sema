/* eslint-disable no-return-assign */
import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveBar } from '@nivo/bar';
import NoChartData from '../noChartData';
import { EMOJIS } from '../../utils/constants';
import {
  greenAvailable,
  orange300,
} from '../../../styles/_colors.module.scss';

const NivoBarChart = ({ yAxisType, emptyChart, barChartData, getDataColor, renderTooltip, maxValue, TotalLabels }) => {
  if (emptyChart) {
    return (
      <NoChartData type="Summaries" />
    );
  }

  return (
    <ResponsiveBar
      data={barChartData}
      keys={EMOJIS.map((item) => item._id)}
      indexBy="date"
      margin={{ top: 50, right: 30, bottom: 120, left: 30 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={getDataColor}
      enableLabel={false}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: greenAvailable,
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: orange300,
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: 'fries',
          },
          id: 'dots',
        },
        {
          match: {
            id: 'sandwich',
          },
          id: 'lines',
        },
      ]}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
      }}
      tooltip={renderTooltip}
      maxValue={maxValue}
      axisLeft={{
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: '',
        legendPosition: 'start',
        legendOffset: -40,
        format: e => Math.floor(e) === e && e
      }}
      enablePoints={false}
      labelSkipWidth={12}
      valueFormat={{ format: ' >-%', enabled: true }}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      legends={[
        {
          dataFrom: 'keys',
          data: EMOJIS.map(({ color, _id, label, emoji }) => ({
            color,
            label: `${emoji} ${label}`,
            id: _id,
          })),
          anchor: 'bottom',
          direction: 'row',
          justify: false,
          translateX: 0,
          translateY: 90,
          itemsSpacing: 7,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 8,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1,
              },
            },
          ],
          translateY: 60
        },
      ]}
 
      layers={['grid', 'markers', 'axes', 'bars', 'points', 'slices', 'mesh', TotalLabels, 'legends']}
    />
  );
};

NivoBarChart.propTypes = {
  yAxisType: PropTypes.string.isRequired,
  emptyChart: PropTypes.bool.isRequired,
  barChartData: PropTypes.array.isRequired,
  getDataColor: PropTypes.func.isRequired,
  renderTooltip: PropTypes.element.isRequired,
  maxValue: PropTypes.number.isRequired,
  TotalLabels: PropTypes.func.isRequired,
};

export default NivoBarChart;
