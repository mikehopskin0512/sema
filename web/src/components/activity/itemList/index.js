import React from 'react'
import PropTypes from 'prop-types'
import ActivityItem from '../item'
import styles from '../../../components/skeletons/charts.module.scss';
import { CommentSnapTitleSkeleton } from '../../skeletons/commentSnapTitleSkeleton';
import CommentSnapSkeleton from '../../skeletons/commentSnapSkeleton';

const ActivityItemList = ({ comments, isLoading }) => {

  if (isLoading) {
    return (
      <div className="my-10">
        <div className={styles['inner-wrapper']}>
          <div className={styles['comment-title']}>
            <CommentSnapTitleSkeleton />
          </div>
          <div className={styles['comment-wrapper']}>
            <CommentSnapSkeleton />
          </div>
          <div className={styles['comment-wrapper']}>
            <CommentSnapSkeleton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {
        comments.length ? comments.map((comment) => {
          return (
            <div className="my-10" key={`activity-${comment._id}`} >
              <ActivityItem {...comment} />
            </div>
          )
        }) : (
          <div className="my-10 p-20 has-background-white">
            <p>No activity found!</p>
          </div>
        )
      }
    </>
  )
}

ActivityItemList.defaultProps = {
  comments: [],
  isLoading: false
};

ActivityItemList.propTypes = {
  comments: PropTypes.array,
  isLoading: PropTypes.bool
};

export default ActivityItemList;
