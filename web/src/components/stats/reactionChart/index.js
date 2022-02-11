import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import BarChart from '../../BarChart';
import styles from './reactionChart.module.scss';
import SnapshotButton from '../../snapshots/snapshotButton';
import { BAR_CHART_MIN_TOP } from '../../../utils/constants';

const ReactionChart = ({
  reactions, className, yAxisType = 'percentage', groupBy, isSnapshot, onClick,
}) => {
  const containerStyles = useMemo(() => (isSnapshot ? styles.snapshotContainer : styles.containers), [isSnapshot]);
  const [tooltipPosition, setTooltipPosition] = useState('top');

  const handleTooltipPosition = (event) => {
    setTooltipPosition(event.clientY > BAR_CHART_MIN_TOP ? 'top' : 'bottom');
  };

  return (
    <>
      <div className={clsx(`is-flex-grow-1 ${isSnapshot ? 'mb-10 pl-5' : 'mb-20 px-10'} ${className}`, containerStyles)} onMouseMove={handleTooltipPosition}>
        <div className={clsx('has-background-white border-radius-2px p-15', styles.shadow)}>
          <div className="is-flex">
            <p className="has-text-black-950 has-text-weight-semibold">Summaries</p>
            {!isSnapshot && onClick && <SnapshotButton onClick={onClick} /> }
          </div>
          <BarChart data={reactions} yAxisType={yAxisType} groupBy={groupBy} tooltipPosition={tooltipPosition}/>
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
};

ReactionChart.propTypes = {
  reactions: PropTypes.array,
  className: PropTypes.string,
  yAxisType: PropTypes.string,
  groupBy: PropTypes.string,
  isSnapshot: PropTypes.bool,
  onClick: PropTypes.bool,
};

export default ReactionChart;
