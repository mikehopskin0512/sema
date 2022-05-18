import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ActivityItem from '../item';
import { filterSmartComments } from '../../../utils/parsing';
import SnapshotModal, { SNAPSHOT_DATA_TYPES } from '../../snapshots/modalWindow';
import SnapshotBar from '../../snapshots/snapshotBar';

const ActivityPage = ({ startDate, endDate, filter }) => {
  const { repositories } = useSelector((state) => ({
    repositories: state.repositoriesState,
  }));
  const { data: { overview } } = repositories;

  // TODO: it will be better to use useReducer here
  const [filteredComments, setFilteredComments] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [componentData, setComponentData] = useState({ yAxisType: 'total' });

  useEffect(() => {
    if (overview && overview.smartcomments) {
      const filtered = filterSmartComments({ filter, smartComments: overview.smartcomments, startDate, endDate });
      setFilteredComments(filtered);
      setComponentData((oldState) => ({ ...oldState, smartComments: filtered, startDate, endDate }));
    }
  }, [overview, filter, startDate, endDate]);

  return (
    <>
      {isOpen && <SnapshotModal dataType={SNAPSHOT_DATA_TYPES.ACTIVITY} active={isOpen} onClose={() => setIsOpen(false)} snapshotData={{ componentData }} />}
      {filteredComments.length ? <SnapshotBar text="Save this as a snapshot on your Portfolio." hasActionButton onClick={() => setIsOpen(true)} /> : null}
      {filteredComments.length ? filteredComments.map((item) => (
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
