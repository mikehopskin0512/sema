import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { reverse, find, round } from 'lodash';
import { format, isValid } from 'date-fns';
import { TooltipWrapper } from '@nivo/tooltip';
import BarChart from '../../BarChart';
import styles from './reactionChart.module.scss';
import SnapshotButton from '../../snapshots/snapshotButton';
import { ArrowDownIcon, ArrowUpIcon } from '../../Icons';
import LineChartSkeleton from '../../skeletons/lineChartSkeleton';
import { BAR_CHART_MIN_TOP, EMOJIS } from '../../../utils/constants';
import { black900 } from '../../../../styles/_colors.module.scss';
import { checkIfDateHasMonth, getTotalReactions } from '../../../utils/codeStats';

const ReactionChart = ({
  reactions, className, yAxisType, groupBy, isSnapshot, onClick, isLoading
}) => {
  const containerStyles = useMemo(() => (isSnapshot ? styles.snapshotContainer : styles.containers), [isSnapshot]);
  const [tooltipPosition, setTooltipPosition] = useState('top');
  const [emptyChart, setEmptyChart] = useState(false);
  const [barChartData, setBarChartData] = useState([]);
  const [maxValue, setMaxValue] = useState(0);

  const handleTooltipPosition = (event) => {
    setTooltipPosition(event.clientY > BAR_CHART_MIN_TOP ? 'top' : 'bottom');
  };

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

  useEffect(() => {
    const total = getTotalReactions(reactions);
    if (total > 0) {
      const parsedData = parseData(reactions);
      setBarChartData(reverse(parsedData));
      setEmptyChart(false);
    } else {
      setEmptyChart(true);
    }
  }, [reactions]);

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
              fill: black900,
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
    const completeData = find(reactions, { date: indexValue });
    if (completeData) {
      const thisReactionData = completeData[id];

      // Parse date format
      let dateString = indexValue;
      if (indexValue.search('-') !== -1) {
        let [date1, date2] = indexValue.split('-');
        date2 = checkIfDateHasMonth(date1, date2);
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

      const getTooltipClasses = () => {
        if (percentage === 0) return 'has-background-gray-200 has-text-black-900'
        if (percentage > 0) {
          return 'has-background-green-600 has-text-green-100'
        }
        return 'has-background-red-600 has-text-red-200'
      }

      return (
        <TooltipWrapper anchor={tooltipPosition} position={[0, 0]}>
          <div className={clsx('box has-background-black p-10 border-radius-4px tooltip-container', styles.tooltip)}>
            <div className="is-flex is-justify-content-space-between is-full-width mb-8">
              <p className="font-size-14 has-text-weight-semibold has-text-white-50">{emoji} {label}</p>
              <div className="font-size-12 has-text-primary has-text-blue-300 has-text-weight-semibold is-uppercase">{dateString}</div>
            </div>
            <p className="font-size-12 line-height-18 has-text-gray-400">{thisReactionData.current} of {colData.total} comment{(colData.total > 1) && `s`}</p>
            <p className="font-size-12 line-height-18 has-text-gray-400">{totalCommentsLabel}</p>
            <div
              className={clsx('is-flex is-align-items-center font-size-10 py-3 px-5 border-radius-4px mt-8', getTooltipClasses())}
            >
              {/* TODO: temp solution since we don't have '=' icon */}
              {percentage === 0 && <span className="font-size-16">=</span>}
              {percentage > 0 ?
                <ArrowUpIcon size="small" /> :
                <ArrowDownIcon size="small" />
              }
              <span className="ml-4">
                {percentage ? `${Math.abs(Math.round(percentage*100)/100)}%` : 'No changes'} from same {groupBy} last {lastPeriod(groupBy)}
              </span>
            </div>
          </div>
        </TooltipWrapper>
      );
    }
  });

  return (
    <>
      <div className={clsx(`is-flex-grow-1 ${isSnapshot ? 'mb-10 pl-5' : 'mb-20 px-10'} ${className}`, containerStyles)} onMouseMove={handleTooltipPosition}>
        <div className={clsx('has-background-white border-radius-8px p-15', styles.shadow, isLoading && styles['loading-container'])}>
          {!isLoading && (
            <>
              <div className="is-flex">
                <p className="has-text-black-950 has-text-weight-semibold">Summaries</p>
                {!emptyChart && !isSnapshot && onClick && <SnapshotButton onClick={onClick} /> }
              </div>
              <BarChart
                yAxisType={yAxisType}
                emptyChart={emptyChart}
                barChartData={barChartData}
                getDataColor={getDataColor}
                renderTooltip={renderTooltip}
                maxValue={maxValue}
                TotalLabels={TotalLabels}
              />
            </>
          )}
          {isLoading && <LineChartSkeleton />}
        </div>
      </div>
    </>
  );
};

ReactionChart.defaultProps = {
  reactions: [],
  className: '',
  yAxisType: 'percentage',
  groupBy: 'day',
  isSnapshot: false,
  isLoading: false
};

ReactionChart.propTypes = {
  reactions: PropTypes.array,
  className: PropTypes.string,
  yAxisType: PropTypes.string,
  groupBy: PropTypes.string,
  isSnapshot: PropTypes.bool,
  onClick: PropTypes.bool,
  isLoading: PropTypes.bool
};

export default ReactionChart;
