import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx';
import BarChart from '../../BarChart'
import styles from './reactionChart.module.scss'

const ReactionChart = ({reactions, className, yAxisType = 'percentage', groupBy}) => {
  return (
    <>
      <div className={clsx(`is-flex-grow-1 px-10 mb-20 ${className}`, styles.containers)}>
        <div className={clsx('has-background-white border-radius-2px p-15', styles.shadow)}>
          <p className="has-text-black-950 has-text-weight-semibold">Summaries</p>
          <BarChart data={reactions} yAxisType={yAxisType} groupBy={groupBy}/>
        </div>
      </div>
    </>
  )
}

ReactionChart.defaultProps = {
  reactions: [],
  className: '',
  yAxisType: 'percentage',
  groupBy: 'day'
};

ReactionChart.PropTypes = {
  reactions: PropTypes.array,
  className: PropTypes.string,
  yAxisType: PropTypes.string,
  groupBy: PropTypes.string,
};

export default ReactionChart
