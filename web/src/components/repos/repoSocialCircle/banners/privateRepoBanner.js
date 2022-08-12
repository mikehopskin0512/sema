import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import styles from './banners.module.scss';

export function PrivateRepoBanner({ customText }) {
  const { user } = useSelector(state => state.authState);
  const { avatarUrl } = user;

  const title = customText ?? 'Private repo GitHub Social Circle coming soon!';

  return (
    <div className={clsx(styles['banner-wrapper'], styles['banner-wrapper-private'],
      'border-radius-8px',
      'is-flex-direction-row',
      'is-justify-content-space-between',
      'is-align-items-center',
      'is-flex-wrap-wrap',
    )}>
      <div>
        <p className={clsx(styles['banner-title'], styles['banner-title-private'])}>{title}</p>
        {!customText && (
          <p className={styles['banner-text']}>
            Until then, why not choose a public repo? <br /> Get syncing and watch the magic happen.
          </p>
        )}
      </div>
      <div className={styles['banner-minions-circle']}>
        <img className={clsx(styles['banners-user-avatar'], styles['banners-user-avatar-static'])} src={avatarUrl} alt='User avatar' />
      </div>
    </div>
  );
};
