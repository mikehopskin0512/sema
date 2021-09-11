import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import data from './data';

const LineChart = () => {
  return(
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 50, bottom: 100, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'transportation',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'count',
            legendOffset: 0,
            legendPosition: 'middle'
        }}
        colors="#333333"
        lineWidth={1}
        pointSize={5}
        pointColor="#333333"
        pointBorderWidth={0}
        pointLabelYOffset={-12}
        enableArea={true}
        areaOpacity={0.2}
        useMesh={true}
        enableGridX={false}
        isInteractive={false}
        areaBaselineValue={0}
    />
  )
}

export default LineChart;