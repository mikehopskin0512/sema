/* eslint-disable no-return-assign */
import React, { useEffect, useState } from 'react';
import { CodeIcon } from '../Icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faEquals } from '@fortawesome/free-solid-svg-icons';
import { ResponsiveBar } from '@nivo/bar';
import { reverse, find, round } from 'lodash';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { EMOJIS } from '../../utils/constants';


const NivoBarChart = ({ data = [], groupBy, yAxisType }) => {
  const [barChartData, setBarChartData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    if (yAxisType === "total") {
      const totalArr = barChartData.filter((chartData) => chartData.total).map((chartData) => chartData.total);
      setMaxValue(Math.max(...totalArr));
    } else {
      setMaxValue(100);
    }
  }, [barChartData])

  const parseData = (rawData) => {
    if (rawData.length) {
      return rawData.map((item) => {
        const keys = Object.keys(item);
        const total = keys.reduce((acc, val) => {
          if (val === 'date') {
            return acc;
          }
          return acc + item[val].current;
        }, 0);
        if (total > 0) {
          const obj = keys.reduce((acc, curr) => {
            if (curr === 'date') {
              return acc[curr] = item[curr], acc;
            }
            if (yAxisType === 'total') {
              return acc[curr] = item[curr].current, acc;
            }
            return acc[curr] = round((item[curr].current * 100) / total, 2), acc;
          }, {});
          return {
            total,
            ...obj,
          }
        }
        return {
          date: item.date,
        };
      });
    }
    return [];
  };

  const getTotalReactions = () => {
    let total = 0;
    data.forEach((item) => {
      let totalItem = 0;
      EMOJIS.forEach((emoji) => {
        totalItem += item[emoji._id].current
      })
      total += totalItem;
    });
    return total;
  }

  useEffect(() => {
    const total = getTotalReactions();
    if (total > 0) {
      const parsedData = parseData(data);
      setBarChartData(reverse(parsedData));
      setNoData(false);
    } else {
      setNoData(true);
    }
  }, [data]);

  const getDataColor = ({ id }) => {
    const emoji = find(EMOJIS, { _id: id });
    return emoji.color;
  };

  const TotalLabels = ({ bars, yScale }) => {
    const labelMargin = 20;
    return bars.map(({ data: { data, indexValue }, x, width }, i) => {
      const total = data?.total

      return (
        <g
          transform={`translate(${x}, ${yAxisType === 'percentage' ? -labelMargin : yScale(total) - labelMargin})`}
          key={`${indexValue}-${i}`}
        >
          <text
            className="bar-total-label"
            x={width / 2}
            y={labelMargin / 2}
            textAnchor="middle"
            alignmentBaseline="central"
            style={{
              fill: '#202020',
              fontSize: '14px'
            }}
          >
            {total >= 1 && total}
          </text>
        </g>
      );
    });
  };

  const renderTooltip = React.memo((itemData) => {
    const { id, value, indexValue, data: colData } = itemData;
    const { emoji, label } = find(EMOJIS, { _id: id });
    const completeData = find(data, { date: indexValue });
    if (completeData) {
      const thisReactionData = completeData[id];

      // Parse date format
      let dateString = indexValue;
      if (indexValue.search('-') !== -1) {
        const [date1, date2] = indexValue.split('-');
        const parsedDate1 = format(new Date(date1), 'LLL d');
        const parsedDate2 = format(new Date(date2), 'LLL d');
        dateString = `${parsedDate1} - ${parsedDate2}`;
      } else {
        const parsedDate = new Date(indexValue);
        const dateValid = isValid(parsedDate);
        if (dateValid) {
          dateString = format(new Date(indexValue), 'LLLL d');
        }
      }

      // Create dynamic totalCommentsLabel
      const totalCommentRange = (groupBy === 'day') ? `on this ${groupBy}` : `this ${groupBy}`;
      const totalCommentsLabel = (yAxisType === 'total') ? round((value * 100) / colData.total, 2) + `% of total comments ${groupBy && totalCommentRange}` : value +
        `% of total comments ${groupBy && totalCommentRange}`;

      // Increase/decrease percentage
      const { current, previous } = completeData[id] ?? {};
      const valDifference = current - previous;
      const percentage = previous ? (valDifference/previous)*100 : 100;

      const lastPeriod = (groupBy) => {
        switch (groupBy) {
          case 'day':
            return 'week';
          case 'week':
            return 'month';
          case 'month':
            return 'year';
          case 'year':
            return 'decade'; // Needs confirmation
        }
      }

      return (
        <div className="box has-background-white p-10 border-radius-4px" style={{ width: 300 }}>
          <div className="is-flex is-justify-content-space-between is-full-width mb-10">
            <p className="has-text-weight-semibold has-text-deep-black is-size-7">{emoji} {label}</p>
            <div className="is-size-7 has-text-primary has-text-weight-semibold is-uppercase">{dateString}</div>
          </div>
          <p className="is-size-7">{thisReactionData.current} of {colData.total} comment{(colData.total > 1) && `s`}</p>
          <p className="is-size-7">{totalCommentsLabel}</p>
          <span className="is-size-7 py-3 px-5 border-radius-4px mt-3" style={{
            background: percentage === 0 ? '#f0f0f0' : percentage > 0 ? 'rgba(52, 168, 83, 0.1)' : '#F6E0E0',
            color: percentage === 0 ? '#202020' : percentage > 0 ? '#34A853' : '#DE3617',
          }}>
            { percentage === 0 ?
              <FontAwesomeIcon icon={faEquals} size="sm" className="mr-5" />  :
              percentage > 0 ? (
                <FontAwesomeIcon icon={faArrowUp} size="sm" color="#34A853" className="mr-5" />
              ) : (
                <FontAwesomeIcon icon={faArrowDown} size="sm" color="#DE3617" className="mr-5" />
              )
            }
            {percentage ? `${Math.abs(Math.round(percentage*100)/100)}%` : 'No changes'} from same {groupBy} last {lastPeriod(groupBy)}
          </span>
        </div>
      );
    }
    return;
  });

  if (noData) {
    return (
      <div className="is-flex is-flex-direction-column is-justify-content-center is-full-height is-align-items-center is-flex-wrap-wrap">
        <CodeIcon size="large" />
        <p className="is-size-5">No Reactions</p>
      </div>
    );
  }

  return (
    <>
      <ResponsiveBar
        data={barChartData}
        keys={EMOJIS.map((item) => item._id)}
        indexBy="date"
        margin={{ top: 50, right: 50, bottom: 120, left: 60 }}
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
            color: '#a9db5f',
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: '#eed312',
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
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Date',
          legendPosition: 'middle',
          legendOffset: 35,
        }}
        tooltip={renderTooltip}
        maxValue={maxValue}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: yAxisType === 'percentage' ? '%' : 'Total Reactions',
          legendPosition: 'middle',
          legendOffset: -40,
        }}
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
        layers={["grid", "axes", "bars", TotalLabels, "markers", "legends"]}
      />
    </>

  );
};

NivoBarChart.defaultProps = {
  groupBy: null,
};

NivoBarChart.propTypes = {
  data: PropTypes.array.isRequired,
  groupBy: PropTypes.string,
};

export default NivoBarChart;
