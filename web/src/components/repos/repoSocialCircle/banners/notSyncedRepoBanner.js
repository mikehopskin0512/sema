import React from 'react';
import clsx from 'clsx';
import styles from './banners.module.scss';
import { UndoIconNew } from '../../../Icons';
import { useSelector } from 'react-redux';

export function NotSyncedRepoBanner() {
  const { user } = useSelector(state => state.authState);
  const { avatarUrl } = user;

  return (
    <div className={clsx(styles['banner-wrapper'], styles['banner-wrapper-not-synced'], 'border-radius-8px',
      'is-flex-direction-row',
      'is-justify-content-space-between',
      'is-align-items-center',
      'is-flex-wrap-wrap')}>
      <div>
          <p className={clsx(styles['banner-title'], styles['banner-title-not-synced'])}>Sync this repo to generate your GitHub Social Circle </p>
          <p className={styles['banner-text']}>
            In order to generate your GitHub Social Circle, we need to import the data for this repo. You can import this repo's data by syncing
            this repo from GitHub.
          </p>
          {/* TODO: add real repo sync action */}
          <button className={clsx('button is-primary my-20', styles['banner-button'])} onClick={() => console.log('sync')}>
            <UndoIconNew />
            Sync Repo
          </button>
      </div>
      <div className={styles['banner-minions-circle']}>
        <img className={clsx(styles['banners-user-avatar'], styles['banners-user-avatar-static'])} src={avatarUrl} alt='User avatar' />
      </div>
    </div>
  );
}
