import React from 'react';
import PropTypes from 'prop-types';
import ActivityItem from '../item';
import styles from '../../../components/skeletons/charts.module.scss';
import { CommentSnapTitleSkeleton } from '../../skeletons/commentSnapTitleSkeleton';
import CommentSnapSkeleton from '../../skeletons/commentSnapSkeleton';
import Pagination from '../../pagination';

const ActivityItemList = ({ comments, pagination, isLoading, setFilter }) => {
  if (isLoading) {
    return (
      <div>
        <div className={styles['inner-wrapper']}>
          <div className={styles['comment-wrapper']}>
            <CommentSnapSkeleton />
          </div>
          <div className={styles['comment-wrapper']}>
            <CommentSnapSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {comments.length ? (
        <>
          {comments.map((comment) => {
            return (
              <div className="my-10" key={`activity-${comment._id}`}>
                <ActivityItem {...comment} />
              </div>
            );
          })}
          {pagination && (
            <Pagination
              currentPage={pagination.pageNumber}
              totalCount={pagination.total}
              pageSize={pagination.pageSize}
              setPageSize={(pageSize) =>
                setFilter((oldState) => ({ ...oldState, pageSize }))
              }
              onPageChange={(page) =>
                setFilter((oldState) => ({ ...oldState, pageNumber: page }))
              }
            />
          )}
        </>
      ) : (
        <div className="my-10 p-20 has-background-white">
          <p>No activity found!</p>
        </div>
      )}
    </>
  );
};

ActivityItemList.defaultProps = {
  comments: [],
  isLoading: false,
};

ActivityItemList.propTypes = {
  comments: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default ActivityItemList;
