import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx';
import BarChart from '../../BarChart'
import styles from './reactionChart.module.scss'

const ReactionChart = ({reactions, className}) => {
  return (
    <>
      <div className={clsx(`is-flex-grow-1 px-10 mb-20 ${className}`, styles.containers)}>
        <div className={clsx('has-background-white border-radius-2px p-15', styles.shadow)}>
          <p className="has-text-deep-black has-text-weight-semibold">Reactions</p>
          <BarChart data={reactions} />
        </div>
      </div>
    </>
  )
}

ReactionChart.defaultProps = {
  reactions: [],
  className: ''
};

ReactionChart.PropTypes = {
  reactions: PropTypes.array,
  className: PropTypes.string
};

export default ReactionChart
