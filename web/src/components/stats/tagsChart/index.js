import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { find, isEmpty, startCase } from 'lodash';
import { TooltipWrapper } from '@nivo/tooltip';
import CircularPacking from '../../CircularPackingChart';
import styles from './tagsChart.module.scss';
import SnapshotButton from '../../snapshots/snapshotButton';
import { CIRCLE_CHART_MIN_TOP, CIRCULAR_PACKING_COLORS, TAGS } from '../../../utils/constants';
import { white0 } from '../../../../styles/_colors.module.scss';
import LineChart from '../../LineChart';
import { format } from 'date-fns';
import DiagramChartSkeleton from '../../../components/skeletons/diagramChartSkeleton';

const DATE_TYPES = {
  CUSTOM: 'custom',
};

const TagsChart = ({
  tags,
  className,
  groupBy,
  isSnapshot,
  onClick,
  startDate,
  endDate,
  dateOption,
  isLoading,
}) => {
  const containerStyles = useMemo(() => (isSnapshot ? styles.snapshotContainer : styles.containers), [isSnapshot]);
  const [tooltipPosition, setTooltipPosition] = useState('top');
  const [emptyChart, setEmptyChart] = useState(false);
  const handleTooltipPosition = (event) => {
    setTooltipPosition(event.clientY > CIRCLE_CHART_MIN_TOP ? 'top' : 'bottom');
  };

  const [circlePackingData, setCirclePackingData] = useState({
    children: [],
  });

  const parseData = (rawData) => {
    let children = [];
    if (rawData) {
      const keys = Object.keys(rawData);
      children = keys.map((_id) => {
        const tag = find(TAGS, { _id });
        if (tag) {
          return {
            isPositive: tag.isPositive,
            name: tag.label,
            id: _id,
            color: tag.isPositive ? CIRCULAR_PACKING_COLORS.POSITIVE : CIRCULAR_PACKING_COLORS.NEGATIVE,
            value: rawData[_id].total,
            data: rawData[_id].data || [],
          };
        }
        return {
          isPositive: false,
          name: '',
          id: _id,
          color: CIRCULAR_PACKING_COLORS.NEGATIVE,
          value: 0,
          data: [],
        };
      });
    }
    const chartData = {
      name: 'Tags',
      color: white0,
      children,
    };
    return chartData;
  };

  const getTotalTags = () => {
    let total = 0;
    const keys = Object.keys(tags);
    keys.forEach((key) => {
      total += tags[key].total;
    });
    return total;
  };

  useEffect(() => {
    const total = getTotalTags();
    if (!isEmpty(tags) && total > 0) {
      const parsedData = parseData(tags);
      setCirclePackingData(parsedData);
      setEmptyChart(false);
    } else {
      setEmptyChart(true);
    }
  }, [tags]);

  const renderTooltip = React.memo(({
    formattedValue,
    value,
    data: tag,
  }) => (
    <TooltipWrapper anchor={tooltipPosition} position={[0, 0]}>
      <div className={clsx('box has-background-black-900 p-20 border-radius-4px', styles.tooltip)}>
        <div className='is-flex is-align-items-center is-justify-content-space-between'>
          <span className='has-text-weight-semibold is-size-7 has-text-white-50'>{tag.name}</span>
          {
            dateOption === DATE_TYPES.CUSTOM
              ? (startDate && <span
                className='has-text-primary'>{format(new Date(startDate ?? Date.now()), 'MMM d, yyyy')} - {format(new Date(endDate ?? Date.now()), 'MMM d, yyyy')}</span>)
              : (<span className='has-text-primary'>{startCase(dateOption)}</span>)
          }
        </div>
        {tag.data.length > 0 && (
          <div className={clsx('py-3', styles['line-chart-container'])}>
            <LineChart data={[tag]} />
          </div>
        )}
        <p className='is-size-7 has-text-white-50'>{value} comments</p>
        <p className='is-size-7 has-text-white-50'>{formattedValue} of all tags</p>
      </div>
    </TooltipWrapper>
  ));

  return (
    <>
      <div className={clsx(`is-flex-grow-1 ${isSnapshot ? 'mb-10 pl-5' : 'mb-20 px-10'} ${className}`, containerStyles)}
           onMouseMove={handleTooltipPosition}>
        <div className={clsx('has-background-white border-radius-2px p-15', styles.shadow)}>
          {!isLoading && (
            <div className='is-flex'>
              <p className='has-text-black-950 has-text-weight-semibold'>Tags</p>
              {!emptyChart && !isSnapshot && onClick && <SnapshotButton onClick={onClick} />}
            </div>
          )}
          {!isLoading && (
            <CircularPacking
              circlePackingData={circlePackingData}
              emptyChart={emptyChart}
              renderTooltip={renderTooltip}
            />
          )}
          {isLoading && <DiagramChartSkeleton />}
        </div>
      </div>
    </>
  );
};

TagsChart.defaultProps = {
  tags: {
    children: [],
  },
  className: '',
  groupBy: 'week',
  isSnapshot: false,
  dateOption: 'custom',
  isLoading: false,
};

TagsChart.propTypes = {
  tags: PropTypes.object,
  className: PropTypes.string,
  groupBy: PropTypes.string,
  isSnapshot: PropTypes.bool,
  onClick: PropTypes.func,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  dateOption: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default TagsChart;
