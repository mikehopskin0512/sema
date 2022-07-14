import React from 'react';
import clsx from 'clsx';
import moment from 'moment';
import { SYNC_STATUS } from '../../../utils/constants';
import { green600, red500 } from '../../../../styles/_colors.module.scss'
import { AlertOutlineIcon, InfoOutlineIcon, QueuedIcon, RefreshIcon, SyncCompletedIcon, SyncInactiveIcon } from '../../Icons';
import styles from './repoSyncText.module.scss';
import Tooltip from '../../Tooltip';


function RepoSyncText({repoStatus, isRepoPage = false, completedAt}) {
  
  const renderInfoIcon = () => {
    const statusesWithIconAllowed = ['notsynced', 'errored', 'unauthorized'];
    return statusesWithIconAllowed.includes(repoStatus);
  }

  const renderCompleteSyncTooltip = () => `Last synced from GitHub ${moment(completedAt).fromNow()}`;

  const syncText = () => 
    <>
      {!isRepoPage && <span className={clsx('ml-8 is-size-8 has-text-weight-semibold', styles[repoStatus])}>
      <Tooltip text={repoStatus !== SYNC_STATUS.completed.status && SYNC_STATUS[repoStatus]?.tooltip}>
        {SYNC_STATUS[repoStatus]?.label || SYNC_STATUS.notsynced.label}
      </Tooltip>
      </span>}
      {isRepoPage && <div className={clsx(styles['tooltip-wrapper'])}>
        <Tooltip text={repoStatus !== SYNC_STATUS.completed.status && SYNC_STATUS[repoStatus]?.tooltip}>
          <span className={clsx('ml-10 is-size-7 has-text-weight-semibold', styles[repoStatus])}>
            {SYNC_STATUS[repoStatus]?.label || SYNC_STATUS.notsynced.label}
          </span>
          {renderInfoIcon() && 
            <InfoOutlineIcon size="small" 
              className={clsx(
                'is-cursor-pointer ml-10', 
                styles['info-icon'], 
                repoStatus === SYNC_STATUS.errored.status && styles[repoStatus]
              )} 
            />
          }
        </Tooltip>
      </div>}
    </>;

  switch (repoStatus) {
    case 'errored':
      return (
        <div className="is-flex is-align-items-center ml-12">
          <AlertOutlineIcon color={red500} size='small' />
          {syncText()}
        </div>
      );
    case 'unauthorized':
      return (
        <div className="is-flex is-align-items-center ml-12">
          <AlertOutlineIcon color={red500} size='small' />
          {syncText()}
        </div>
      );
    case 'started':
      return (
        <div className="is-flex is-align-items-center ml-12">
          <RefreshIcon color={green600} className="spinner-loader" />
          {syncText()}
        </div>
      );
    case 'completed':
      return (
        <div className={clsx("is-flex is-align-items-center ml-12", styles['completed-tooltip'])}>
          <Tooltip text={renderCompleteSyncTooltip()}>
            <SyncCompletedIcon size={isRepoPage ? "medium" : "small"} className={clsx(styles[repoStatus])} />
            {syncText()}
          </Tooltip>
        </div>
      );
    case 'queued':
      return (
        <div className="is-flex is-align-items-center ml-12">
          <QueuedIcon size={isRepoPage ? "medium" : "small"} />
          {syncText()}
        </div>
      );
    default:
      return (
        <div className="is-flex is-align-items-center ml-12">
          <SyncInactiveIcon size="small" />
          {syncText()}
        </div>
      );
  }
}

export default RepoSyncText;
