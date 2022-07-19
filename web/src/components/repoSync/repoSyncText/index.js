import React, { useEffect } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import { SYNC_STATUS } from '../../../utils/constants';
import { green600, red500 } from '../../../../styles/_colors.module.scss'
import { AlertOutlineIcon, InfoOutlineIcon, QueuedIcon, RefreshIcon, SyncCompletedIcon, SyncInactiveIcon } from '../../Icons';
import styles from './repoSyncText.module.scss';

function RepoSyncText({repoStatus, isRepoPage = false, completedAt}) {
  
  const renderInfoIcon = () => {
    const statusesWithIconAllowed = ['notsynced', 'errored', 'unauthorized'];
    return statusesWithIconAllowed.includes(repoStatus);
  }

  const renderCompleteSyncTooltip = () => `Last synced from GitHub ${moment(completedAt).fromNow()}`;

  const renderStandardTooltip = () => repoStatus !== SYNC_STATUS.completed.status ? SYNC_STATUS[repoStatus]?.tooltip : null;

  const syncClass = "is-flex is-align-items-center ml-12";

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const syncText = () => 
    <>
      {!isRepoPage &&
        <span className={clsx('ml-8 is-size-8 has-text-weight-semibold', styles[repoStatus])}>
              {SYNC_STATUS[repoStatus]?.label || SYNC_STATUS.notsynced.label}
          </span>
      }
      {isRepoPage && 
        <div className={clsx(styles['tooltip-wrapper'])}>
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
        </div>
      }
    </>;

  switch (repoStatus) {
    case 'errored':
      return (
        <div data-tip={renderStandardTooltip()}  className={syncClass}>
          <AlertOutlineIcon color={red500} size='small' />
          {syncText()}
        </div>
      );
    case 'unauthorized':
      return (
        <div data-tip={renderStandardTooltip()}  className={syncClass}>
          <AlertOutlineIcon color={red500} size='small' />
          {syncText()}
        </div>
      );
    case 'started':
      return (
        <div data-tip={renderStandardTooltip()}  className={syncClass}>
          <RefreshIcon color={green600} className="spinner-loader" />
          {syncText()}
        </div>
      );
    case 'completed':
      return (
        <div data-tip={renderCompleteSyncTooltip()} className={clsx(syncClass, styles['completed-tooltip'])}>          
          <SyncCompletedIcon size={isRepoPage ? "medium" : "small"} className={clsx(styles[repoStatus])} />
          {syncText()}
        </div>
      );
    case 'queued':
      return (
        <div data-tip={renderStandardTooltip()}  className={syncClass}>
          <QueuedIcon size={isRepoPage ? "medium" : "small"} />
          {syncText()}
        </div>
      );
    default:
      return (
        <div data-tip={renderStandardTooltip()}  className={syncClass}>
          <SyncInactiveIcon size="small" />
          {syncText()}
        </div>
      );
  }
}

export default RepoSyncText;
