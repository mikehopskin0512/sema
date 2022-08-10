import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { TooltipWrapper } from '@nivo/tooltip';
import { format, isValid } from 'date-fns';
import { find, findIndex, round } from 'lodash';
import LineChart from './lineChart';
import SnapshotButton from '../../snapshots/snapshotButton';
import styles from './reactionLineChart.module.scss';
import { ArrowDownIcon, ArrowUpIcon } from '../../Icons';
import { BAR_CHART_MIN_TOP, EMOJIS } from '../../../utils/constants';
import { checkIfDateHasMonth, getTotalReactions } from '../../../utils/codeStats';
import LineChartSkeleton from '../../../components/skeletons/lineChartSkeleton';

const ReactionLineChart = ({
  reactions, className, groupBy, isSnapshot, onClick, isLoading
}) => {
  const containerStyles = useMemo(() => (isSnapshot ? styles.snapshotContainer : styles.containers), [isSnapshot]);
  const [emptyChart, setEmptyChart] = useState(false);
  const [lineChartData, setLineChartData] = useState([])
  const [tooltipPosition, setTooltipPosition] = useState('top');

  const handleTooltipPosition = (event) => {
    setTooltipPosition(event.clientY > BAR_CHART_MIN_TOP ? 'top' : 'bottom');
  };

  const reactionsToLineChart = (reactions) => {
    const lineChartData = []
    reactions.forEach((r) => {
      const { date, ...dateReactions } = r;
      const total = Object.keys(dateReactions).reduce((previous, key) =>  {
        return previous + dateReactions[key].current;
      }, 0);
      EMOJIS.forEach((e) => {
        const { _id: emojiId, color } = e
        const percentageValue = total === 0 ? 0 : round(r[emojiId].current * 100 / total, 2) ;
        const obj = {
          x: r.date,
          y: percentageValue,
          tooltipData: r[emojiId]
        }
        const index = findIndex(lineChartData, { id: emojiId })
        if (index !== -1) {
          lineChartData[index].data.unshift(obj)
        } else {
          const reactionObj = {
            id: emojiId,
            color,
            data: [obj]
          };
          lineChartData.push(reactionObj);
        }
      })
    });
    return lineChartData;
  };

  useEffect(() => {
    const total = getTotalReactions(reactions);
    if (total > 0) {
      const parsed = reactionsToLineChart(reactions);
      setLineChartData(parsed)
      setEmptyChart(false);
    } else {
      setEmptyChart(true);
    }
  }, [reactions]);

  const renderTooltip = React.memo(({ point }) => {
    const { serieId, data } = point;
    const { x: dateId, tooltipData: hoveredData, y: value  } = data;
    const { emoji, label } = find(EMOJIS, { _id: serieId });
    const completeData = find(lineChartData, { id: serieId });
    const reactionObj = find(reactions, { date: dateId })
    const totalCol = Object.keys(reactionObj).filter((d) => d !== 'date').reduce((previous, b) => (previous + reactionObj[b].current), 0)
    if (completeData) {
      const thisReactionData = hoveredData

      let dateString = dateId;
      // Parse date format
      if (dateId.search('-') !== -1) {
        let [date1, date2] = dateId.split('-');
        date2 = checkIfDateHasMonth(date1, date2);
        const parsedDate1 = format(new Date(date1), 'LLL d');
        const parsedDate2 = format(new Date(date2), 'LLL d');
        dateString = `${parsedDate1} - ${parsedDate2}`;
      } else {
        const parsedDate = new Date(dateId);
        const dateValid = isValid(parsedDate);
        if (dateValid) {
          dateString = format(new Date(dateId), 'LLLL d');
        }
      }

      // Create dynamic totalCommentsLabel
      const totalCommentRange = (groupBy === 'day') ? `on this ${groupBy}` : `this ${groupBy}`;
      const totalCommentsLabel = value + `% of total comments ${groupBy && totalCommentRange}`;

      // Increase/decrease percentage
      const { current, previous } = hoveredData ?? {};
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
            <p className="font-size-12 line-height-18 has-text-gray-400">{thisReactionData.current} of {totalCol} comment{(totalCol > 1) && `s`}</p>
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

  const isButtonActive = !emptyChart && onClick;

  return (
    <>
      <div className={clsx(`is-flex-grow-1 ${isSnapshot ? 'mb-10 pl-5' : 'mb-20 px-10'} ${className}`, containerStyles)} onMouseMove={handleTooltipPosition}>
        <div className={clsx('has-background-white border-radius-8px p-15', styles.shadow, isLoading && styles['loading-container'])}>
          {!isLoading && (
            <>
              <div className="is-flex">
                <p className="has-text-black-950 has-text-weight-semibold">Overall Repo Summaries</p>
                {!isSnapshot && <SnapshotButton onClick={onClick} disabled={!isButtonActive} />}
              </div>
              <LineChart
                data={lineChartData}
                emptyChart={emptyChart}
                renderTooltip={renderTooltip}
              />
            </>
          )}
          {isLoading && <LineChartSkeleton />}
        </div>
      </div>
    </>
  )
}


ReactionLineChart.defaultProps = {
  reactions: [],
  className: '',
  groupBy: 'day',
  isSnapshot: false,
  isLoading: false
};

ReactionLineChart.propTypes = {
  reactions: PropTypes.array,
  className: PropTypes.string,
  groupBy: PropTypes.string,
  isSnapshot: PropTypes.bool,
  onClick: PropTypes.bool,
  isLoading: PropTypes.bool
};

export default ReactionLineChart;
