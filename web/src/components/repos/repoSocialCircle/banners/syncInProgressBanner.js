import React from 'react';
import styles from './banners.module.scss';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { Spinner } from '../../../Loader/spinner';

export const SyncInProgressRepoBanner = ({ isLoading }) => {
  const { user } = useSelector(state => state.authState);
  const { avatarUrl } = user;

  return (
    <div
      className={clsx(styles['banner-wrapper'],
        styles['banner-wrapper-sync-in-progress'],
        'is-flex-direction-row',
        'is-justify-content-space-between',
        'is-align-items-center',
        'is-flex-wrap-wrap',
        isLoading && styles['banner-wrapper-filtered'])
      }>
      <div>
        <p
          className={clsx(styles['banner-title'], styles['banner-title-private'])}>{isLoading ? 'Loading...' : 'Generating your GitHub Social Circle...'}</p>
        {!isLoading && (
          <p className={styles['banner-text']}>
            Once your repo data is successfully imported, you’ll be able to see <br /> your collaboration crew in all their glory.
            <br />Check back in a few minutes!
          </p>
        )}
      </div>
      <div className={styles['banner-minions-circle']}>
        {!isLoading && <img className={styles['banners-user-avatar']} src={avatarUrl} alt='User avatar' />}
        <div className={styles['banner-loader']}>
          <Spinner />
        </div>
      </div>
    </div>
  );
};
