import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveLine } from '@nivo/line';
import { blue500, blue900, white50 } from '../../../styles/_colors.module.scss'

const LineChart = ({ data = [] }) => {
  const breakText = (text) => {
    const dashIndex = text.search('-');
    if (dashIndex !== -1) {
      return (
        <>
          <tspan x='0' dy="1.2em">{text.slice(0,dashIndex+1)}</tspan>
          <tspan x='0' dy="1.2em">{text.slice(dashIndex+1)}</tspan>
        </>
      )
    }
    return (
      <tspan>{text}</tspan>
    )
  }

  const maxGraphYValue = useMemo(() => Math.max(...data?.[0]?.data?.map(i => i.y)), [data]);

  const isFitScreen = maxGraphYValue <= 10;

  const getYAxisGrid = () => {
    if (isFitScreen) return [...new Array(10).keys()];
    else {
      const partsCount = Math.ceil(maxGraphYValue / 10);
      return [...new Array(partsCount + 1).keys()].map(i => i * 10);
    }
  }

  return(
      <ResponsiveLine
        data={data}
        theme={{
          textColor: white50,
        }}
        margin={{ top: 10, right: 25, bottom: 50, left: 25 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
        yFormat=">+0.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendOffset: 0,
          legendPosition: 'middle',
          format: e => breakText(e)
        }}
        axisLeft={{
            maxValue: maxGraphYValue,
            orient: 'left',
            tickSize: 5,
            tickPadding: 2,
            tickRotation: 0,
            legend: '',
            legendOffset: -40,
            legendPosition: 'middle',
            tickValues: getYAxisGrid(),
            format: e => Math.floor(e) === e && e
        }}
        colors={blue900}
        lineWidth={1}
        pointSize={5}
        pointColor={blue500}
        pointBorderWidth={0}
        pointLabelYOffset={-12}
        enableArea={true}
        areaOpacity={1}
        useMesh={true}
        enableGridX={false}
        enableGridY={true}
        isInteractive={false}
        areaBaselineValue={0}
        gridYValues={getYAxisGrid()}
    />
  )
}

LineChart.propTypes = {
  data: PropTypes.array.isRequired,
}

export default React.memo(LineChart);
