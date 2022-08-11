import React, { useEffect } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import { getStatusLabels, REPO_VISIBILITY, SYNC_STATUS } from '../../../utils/constants';
import { gray700, green600, red500 } from '../../../../styles/_colors.module.scss'
import { AlertOutlineIcon, InfoOutlineIcon, QueuedIcon, RefreshIcon, SyncCompletedIcon, SyncInactiveIcon } from '../../Icons';
import styles from './repoSyncText.module.scss';

function RepoSyncText({repoStatus, progress, completedAt, isRepoPage = false, action = null, visibility}) {

  const STATUS_LABELS = getStatusLabels(repoStatus, progress);
  
  const renderInfoIcon = () => {
    const statusesWithIconAllowed = ['notsynced', 'errored', 'unauthorized'];
    return statusesWithIconAllowed.includes(repoStatus);
  }

  const renderCompleteSyncTooltip = () => `Last synced from GitHub ${moment(completedAt).fromNow()}`;

  const renderStandardTooltip = () => repoStatus !== SYNC_STATUS.completed.status ? STATUS_LABELS.tooltip : null;

  const syncClass = "is-flex is-align-items-center";

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const renderClickableTooltip = () => (
    <ReactTooltip id='global' clickable globalEventOff='click'>
      <span>
        {repoStatus === SYNC_STATUS.notsynced.status ?
          <>
            <a className='has-text-white is-clickable is-underlined' onClick={action}>
              Activate Github Sync
            </a>
            {` to unlock the full power of Sema for this repo.`}
          </> :
          <>
            {`An error occurred - please `}
            <a className='has-text-white is-clickable is-underlined' onClick={action}>
              retry activating Github Sync for this repo.
            </a>
          </>
        }
      </span>
    </ReactTooltip>
  );

  const syncText = () => 
    <>
      {!isRepoPage &&
        <span className={clsx('ml-8 is-size-8 has-text-weight-semibold', styles[repoStatus])}>
          {STATUS_LABELS.label || SYNC_STATUS.notsynced.label}
        </span>
      }
      {isRepoPage && 
        <div className={clsx(styles['tooltip-wrapper'])}>
          <span className={clsx('ml-10 is-size-7 has-text-weight-semibold', styles[repoStatus])}>
            {STATUS_LABELS.label || SYNC_STATUS.notsynced.label}
          </span>
          {renderInfoIcon() && isRepoPage &&
            <>
              <InfoOutlineIcon size="small" 
                className={clsx(
                  'is-cursor-pointer ml-10', 
                  styles['info-icon'], 
                  repoStatus === SYNC_STATUS.errored.status && styles[repoStatus]
                )} 
                data-event='click'
                data-for='global'
                data-tip
              />
              {renderClickableTooltip()}
            </>
          }
        </div>
      }
    </>;

  if (visibility === REPO_VISIBILITY.PRIVATE) {
    return (
      <div className={syncClass}>
        <SyncInactiveIcon size="small" color={gray700} />
        <span className={clsx("ml-4 is-size-8 has-text-weight-semibold", styles.private)}>
          {SYNC_STATUS.notsynced.label}
        </span>
        <InfoOutlineIcon size="small" className="ml-4" color={gray700} />
      </div>
    );
  }

  switch (repoStatus) {
    case 'errored':
      return (
        <div data-tip={!isRepoPage ? renderStandardTooltip() : null}  className={syncClass}>
          <AlertOutlineIcon color={red500} size='small' />
          {syncText()}
        </div>
      );
    case 'unauthorized':
      return (
        <div data-tip={!isRepoPage ? renderStandardTooltip() : null}  className={syncClass}>
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
        <div data-tip={!isRepoPage ? renderStandardTooltip() : null} className={syncClass}>
          <SyncInactiveIcon size="small" />
          {syncText()}
        </div>
      );
  }
}

export default RepoSyncText;
