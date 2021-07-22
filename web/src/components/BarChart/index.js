/* eslint-disable no-sequences */
/* eslint-disable no-return-assign */
import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import clsx from 'clsx';
import { find, round } from 'lodash';
import PropTypes from 'prop-types';
import { EMOJIS } from './data';
import styles from './barChart.module.scss';

const NivoBarChart = ({ data = [] }) => {
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
        return keys.reduce((acc, curr) => {
          if (curr === 'date') {
            return acc[curr] = item[curr], acc;
          }
          return acc[curr] = round((item[curr] * 100) / total, 2), acc;
        }, {});
      });
    }
    return [];
  };

  const customTooltip = (itemData) => {
    const { id, indexValue } = itemData;
    const { emoji, label } = find(EMOJIS, { _id: id });
    const ogData = find(data, { date: indexValue });
    return (
      <div className={clsx('has-background-white px-10 py-5 border-radius-4px', styles['tooltip-container'])}>
        <p className="has-text-deep-black has-text-weight-semibold is-size-7">{emoji} {label}: {ogData[id]}</p>
      </div>
    );
  };

  return (
    <>
      <ResponsiveBar
        data={parseData(data)}
        keys={EMOJIS.map((item) => item._id)}
        indexBy="date"
        margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
        label={(val) => `${val.value}%`}
        defs={[
          {
            id: 'dots',
            type: 'patternDots',
            background: 'inherit',
            color: '#38bcb2',
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
          legendOffset: 40,
        }}
        tooltip={customTooltip}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '%',
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        valueFormat={{ format: ' >-%', enabled: true }}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        legends={[]} />
    </>

  );
};

NivoBarChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default NivoBarChart;
