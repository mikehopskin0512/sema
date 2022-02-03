import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx';
import CircularPacking from '../../CircularPackingChart';
import styles from './tagsChart.module.scss';
import SnapshotButton from '../../snapshots/snapshotButton';


const TagsChart = ({tags, className, groupBy, isSnapshot, onClick}) => {
  const containerStyles = useMemo(() => isSnapshot ? styles.snapshotContainer : styles.containers , [isSnapshot]);
  return (
    <>
      <div className={clsx(`is-flex-grow-1 ${isSnapshot ? 'mb-10 pl-5' : 'mb-20 px-10'} ${className}`, containerStyles)}>
          <div className={clsx('has-background-white border-radius-2px p-15', styles.shadow)}>
            <div className="is-flex">
              <p className="has-text-black-950 has-text-weight-semibold">Tags</p>
              {!isSnapshot && <SnapshotButton onClick={onClick}/>}
            </div>
            <CircularPacking data={tags} groupBy={groupBy} />
          </div>
        </div>
    </>
  )
}

TagsChart.defaultProps = {
  tags: {
    children: [],
  },
  className: '',
  isSnapshot: false,
  onClick: () => {},
};

TagsChart.PropTypes = {
  tags: PropTypes.object,
  className: PropTypes.string,
  isSnapshot: PropTypes.bool,
  onClick: PropTypes.func,
};

export default TagsChart
