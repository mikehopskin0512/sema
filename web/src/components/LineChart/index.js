import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveLine } from '@nivo/line';

const LineChart = ({ data = [] }) => {
  const tickValues = data?.[0]?.data?.length || 2
  return(
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 25, bottom: 25, left: 25 }}
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
          legendOffset: 0,
          legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendOffset: -40,
            legendPosition: 'middle',
            tickValues: tickValues
        }}
        colors="#BFCBD3"
        lineWidth={1}
        pointSize={5}
        pointColor="#333333"
        pointBorderWidth={0}
        pointLabelYOffset={-12}
        enableArea={true}
        areaOpacity={1}
        useMesh={true}
        enableGridX={false}
        enableGridY={false}
        isInteractive={false}
        areaBaselineValue={0}
    />
  )
}

LineChart.propTypes = {
  data: PropTypes.array.isRequired,
}

export default React.memo(LineChart);