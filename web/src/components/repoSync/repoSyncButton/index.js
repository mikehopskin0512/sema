import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { getStatusLabels, SYNC_STATUS } from '../../../utils/constants';
import { ResendIcon } from '../../Icons';
import * as api from '../../../state/utils/api';
import RepoSyncText from '../repoSyncText';

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
  const progress = overview.sync?.progress || {};
  
  const STATUS_LABELS = getStatusLabels(sync.status, progress);

  const [triggeredRepoSync, setTriggeredRepoSync] = useState(false);
 
  const handleOnClick = async () => {
    await api.create(`/api/proxy/repositories/${_id}/sync`, {}, token);
    setTriggeredRepoSync(true);
  }

  const isSyncStartedOrQueued = () => [SYNC_STATUS.started.status, SYNC_STATUS.queued.status].includes(sync.status);

  const renderSyncButton = () => (
    <button 
      className="button is-primary border-radius-4px"
      type="button"
      onClick={handleOnClick}
      disabled={isSyncStartedOrQueued()}
      data-tip={STATUS_LABELS.tooltip}
    >
      <ResendIcon size="small" />
      <span className="ml-10">Sync Repo</span>
    </button>
  );
  
  useEffect(() => {
    if(isSyncStartedOrQueued()  || triggeredRepoSync) {
      const id = setInterval(refresh, 5000);
      return () => {
        clearInterval(id);
      };
    }
  }, [sync, triggeredRepoSync]);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return Object.getOwnPropertyDescriptor(overview, 'repoStats') ? (
    <div className='is-flex'>
      <div className='is-flex is-align-items-center mr-24'>
        <RepoSyncText 
          repoStatus={sync.status}
          progress={progress}
          completedAt={sync.completedAt}
          isRepoPage
        />
      </div>
      {isSyncStartedOrQueued() && renderSyncButton()}
      {!isSyncStartedOrQueued() && sync.status !== SYNC_STATUS.completed.status && renderSyncButton()}
    </div>
  ) : null;
}

export default RepoSyncButton;
