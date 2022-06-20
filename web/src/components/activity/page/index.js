import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ActivityItem from '../item';
import SnapshotModal, { SNAPSHOT_DATA_TYPES } from '../../snapshots/modalWindow';
import SnapshotBar from '../../snapshots/snapshotBar';

const ActivityPage = () => {
  const { repoSmartComments } = useSelector((state) => ({
    repoSmartComments: state.repoSmartCommentsState,
  }));
  const { data: { smartComments } } = repoSmartComments;
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
    </>
  );
};

export default ActivityPage;
