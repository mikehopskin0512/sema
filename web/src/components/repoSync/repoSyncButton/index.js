import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SYNC_STATUS } from '../../../utils/constants';
import { ResendIcon } from '../../Icons';
import * as api from '../../../state/utils/api';
import RepoSyncText from '../repoSyncText';
import Tooltip from '../../Tooltip';

function RepoSyncButton({refresh}) {
	const { token } = useSelector((state) => state.authState);
  const { repositories } = useSelector((state) => ({
    repositories: state.repositoriesState,
  }));

  const {
    data: { overview },
  } = repositories;

	const { _id } = overview;
  const sync = overview.sync || {
    status: 'notsynced'
  };

  const [triggeredRepoSync, setTriggeredRepoSync] = useState(false);
 
  const handleOnClick = async () => {
    await api.create(`/api/proxy/repositories/${_id}/sync`, {}, token);
    setTriggeredRepoSync(true);
  }

  const isStatusStartedOrQueued = () => [SYNC_STATUS.started.status, SYNC_STATUS.queued.status].includes(sync.status);

  const renderSyncButton = () => (
    <button 
      className="button is-primary border-radius-4px"
      type="button"
      onClick={handleOnClick}
      disabled={isStatusStartedOrQueued()}
    >
      <ResendIcon size="small" />
      <span className="ml-10">Sync Repo</span>
    </button>
  );
  
  useEffect(() => {
    if(isStatusStartedOrQueued()  || triggeredRepoSync) {
      const id = setInterval(refresh, 5000);
      return () => {
        clearInterval(id);
      };
    }
  }, [sync, triggeredRepoSync]);

  return Object.getOwnPropertyDescriptor(overview, 'repoStats') ? (
    <div className='is-flex'>
      <div className='is-flex is-align-items-center mr-24'>
        <RepoSyncText repoStatus={sync.status} isRepoPage completedAt={sync.completedAt} />
      </div>
      {isStatusStartedOrQueued() &&
        <Tooltip text={SYNC_STATUS[sync.status]?.tooltip}>
          {renderSyncButton()}
        </Tooltip>}
        {!isStatusStartedOrQueued() && sync.status !== SYNC_STATUS.completed.status && renderSyncButton()}
    </div>
  ) : null;
}

export default RepoSyncButton;
