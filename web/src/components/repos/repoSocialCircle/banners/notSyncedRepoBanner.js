import React from 'react';
import styles from './banners.module.scss';
import clsx from 'clsx';
import { UndoIconNew } from '../../../../components/Icons';

export const NotSyncedRepoBanner = () => {
  return (
    <div className={clsx(styles['banner-wrapper'], styles['banner-wrapper-not-synced'])}>
      <p className={clsx(styles['banner-title'], styles['banner-title-not-synced'])}>Sync this repo to generate your GitHub Social Circle </p>
      <p className={styles['banner-text']}>
        In order to generate your GitHub Social Circle, we need to import the data for <br /> this repo. You can import this repo's data by syncing
        this repo from GitHub.
      </p>
      {/* TODO: add real repo sync action */}
      <button className={clsx('button is-primary my-20', styles['banner-button'])} onClick={() => console.log('sync')}>
        <UndoIconNew />
        Sync Repo
      </button>
    </div>
  );
};
