import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx';
import CircularPacking from '../../CircularPackingChart'
import styles from './tagsChart.module.scss'


const TagsChart = ({tags, className}) => {
  return (
    <>
      <div className={clsx(`is-flex-grow-1 px-10 mb-20 ${className}`, styles.containers)}>
          <div className={clsx('has-background-white border-radius-2px p-15', styles.shadow)}>
            <p className="has-text-deep-black has-text-weight-semibold">Tags</p>
            <CircularPacking data={tags} />
          </div>
        </div>
    </>
  )
}

TagsChart.defaultProps = {
  tags: {
    children: [],
  },
  className: ''
};

TagsChart.PropTypes = {
  tags: PropTypes.object,
  className: PropTypes.string

};

export default TagsChart
