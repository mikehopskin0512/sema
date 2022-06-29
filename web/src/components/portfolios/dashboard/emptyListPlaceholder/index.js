import React from 'react';
import styles from './emptyListPlaceholder.module.scss';
import clsx from 'clsx';
import { KNOWLEDGE_BASE_USER_PORTFOLIO } from '../../../../utils/constants';

export const EmptyListPlaceholder = () => {
  return (
    <div className={styles['empty-list-wrapper']}>
      <div className={styles['empty-list-content']}>
        <p className={styles['empty-list-title']}>
          Portfolios are designed to help you show off <br /> your hard work

        </p>
        <p className={styles['empty-list-text']}>
          Add some snapshots from your personal insights & <br /> activity log to get started.
        </p>
        <button
          onClick={(e) => {
            e.preventDefault();
            window.open(KNOWLEDGE_BASE_USER_PORTFOLIO, '_blank');
          }}
          type='button'
          className={clsx('button is-primary has-text-centered has-text-white', styles['empty-list-button'])}
        >
          Learn How It Works
        </button>
      </div>
      <img src='/img/empty-portfolio-placeholder.png' alt='Empty snapshots list placeholder' className={styles['empty-list-img']} />
    </div>
  );
};
