import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import React from 'react';
import { EMOJIS } from '../../../utils/constants';
import NoChartData from '../../noChartData';

const LineChart = ({ data = [], renderTooltip, emptyChart }) => {
  if (emptyChart) {
    return (
      <NoChartData type="Summaries" />
    );
  }
  const getDataColor = ({ id }) => {
    const emoji = find(EMOJIS, { _id: id });
    return emoji.color;
  };

  return (
    <ResponsiveLine
      data={data}
      enableArea
      areaOpacity={1}
      margin={{ top: 50, right: 50, bottom: 120, left: 60 }}
      colors={getDataColor}
      sliceTooltip={renderTooltip}
      tooltip={renderTooltip}
      enableGridY={false}
      enableCrosshair={false}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: '0',
        max: '100',
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '%',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh
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
          itemsSpacing: 5,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 15,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

LineChart.propTypes = {
  emptyChart: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  renderTooltip: PropTypes.element.isRequired,
};

export default LineChart;
