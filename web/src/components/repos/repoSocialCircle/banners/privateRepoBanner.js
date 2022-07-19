import React from 'react';
import styles from './banners.module.scss';
import clsx from 'clsx';

export const PrivateRepoBanner = () => {
  return (
    <div className={clsx(styles['banner-wrapper'], styles['banner-wrapper-private'])}>
      <p className={clsx(styles['banner-title'], styles['banner-title-private'])}>Private repo GitHub Social Circle coming soon!</p>
      <p className={styles['banner-text']}>
        Until then, why not choose a public repo? <br /> Get syncing and watch the magic happen.
      </p>
    </div>
  );
};
