import React from 'react';
import styles from './banners.module.scss';
import clsx from 'clsx';
import { useSelector } from 'react-redux';

export const PrivateRepoBanner = () => {
  const { user } = useSelector(state => state.authState);
  const { avatarUrl } = user;

  return (
    <div className={clsx(styles['banner-wrapper'], styles['banner-wrapper-private'],
      'is-flex-direction-row',
      'is-justify-content-space-between',
      'is-align-items-center',
      'is-flex-wrap-wrap',
    )}>
      <div>
        <p className={clsx(styles['banner-title'], styles['banner-title-private'])}>Private repo GitHub Social Circle coming soon!</p>
        <p className={styles['banner-text']}>
          Until then, why not choose a public repo? <br /> Get syncing and watch the magic happen.
        </p>
      </div>
      <div className={styles['banner-minions-circle']}>
        <img className={clsx(styles['banners-user-avatar'], styles['banners-user-avatar-static'])} src={avatarUrl} alt='User avatar' />
      </div>
    </div>
  );
};
