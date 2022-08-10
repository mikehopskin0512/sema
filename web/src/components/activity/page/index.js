import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ActivityItem from '../item';
import SnapshotModal, { SNAPSHOT_DATA_TYPES } from '../../snapshots/modalWindow';
import SnapshotBar from '../../snapshots/snapshotBar';
import Pagination from '../../pagination';

const ActivityPage = ({ setFilter }) => {
  const { comments } = useSelector((state) => ({
    comments: state.commentsState,
  }));
  const { searchResults: smartComments, pagination } = comments;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && <SnapshotModal dataType={SNAPSHOT_DATA_TYPES.ACTIVITY} active={isOpen} onClose={() => setIsOpen(false)} snapshotData={{ smartComments }} />}
      {smartComments.length ? <SnapshotBar text="Save this as a snapshot on your Portfolio." hasActionButton onClick={() => setIsOpen(true)} /> : null}
      {smartComments.length ? smartComments.map((item) => (
        <div className="my-10" key={`activity-${item._id}`}>
          <ActivityItem {...item} />
        </div>
      )) : (
        <div className="my-10 p-20 has-background-white">
          <p>No activity found!</p>
        </div>
      )}
      <Pagination
        currentPage={pagination.pageNumber}
        totalCount={pagination.total}
        pageSize={pagination.pageSize}
        setPageSize={(pageSize) => setFilter((oldState) => ({ ...oldState, pageSize }))}
        onPageChange={(page) => setFilter((oldState) => ({ ...oldState, pageNumber: page }))}
      />
    </>
  );
};

export default ActivityPage;
