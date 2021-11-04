/* eslint-disable no-sequences */
/* eslint-disable no-return-assign */
import React, { useEffect, useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-regular-svg-icons';
import { ResponsiveBar } from '@nivo/bar';
import { reverse, find, round, groupBy } from 'lodash';
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
          return acc + item[val];
        }, 0);
        if (total > 0) {
          const obj = keys.reduce((acc, curr) => {
            if (curr === 'date' || yAxisType === 'total') {
              return acc[curr] = item[curr], acc;
            }
            return acc[curr] = round((item[curr] * 100) / total, 2), acc;
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
        totalItem += item[emoji._id]
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

  const renderTooltip = React.memo((itemData) => {
    const { id, value, indexValue, data: colData } = itemData;
    const { total } = colData;
    const { emoji, label } = find(EMOJIS, { _id: id });
    const count = find(data, { date: indexValue })[id];

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
    const totalCommentsLabel = (yAxisType === 'total') ? round((value*100)/total, 2) : value +
                                `% of total comments ${groupBy && totalCommentRange}` || '';

    return (
      <div className="box has-background-white p-10 border-radius-4px" style={{ width: 300 }}>
        <div className="is-flex is-justify-content-space-between is-full-width mb-10">
          <p className="has-text-weight-semibold has-text-deep-black is-size-7">{emoji} {label}</p>
          <div className="is-size-7 has-text-primary has-text-weight-semibold is-uppercase">{dateString}</div>
        </div>
        <p className="is-size-7">{count} of {total} comment{(total > 1) && `s`}</p>
        <p className="is-size-7">{totalCommentsLabel}</p>
      </div>
    );
  });

  if (noData) {
    return (
      <div className="is-flex is-flex-direction-column is-justify-content-center is-full-height is-align-items-center is-flex-wrap-wrap">
        <FontAwesomeIcon icon={faChartBar} size="3x" />
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
        ]} />
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
