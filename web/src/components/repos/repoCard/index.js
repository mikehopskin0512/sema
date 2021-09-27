import React, { useState } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import styles from './repoCard.module.scss';
import RepoUsers from '../repoUsers';

const statLabels = {
  totalPullRequests: 'Smart Code Reviews',
  totalSmartComments: 'Smart Comments',
  totalSmartCommenters: 'Smart Commenters',
  totalSemaUsers: 'Sema User',
};

const RepoCard = (props) => {
  const {
    name, externalId, stats, users,
  } = props;

  const onClickRepo = () => {
    // Change Redirect link when overview is done!
    window.location = `/repo/${externalId}`;
  };

  const renderStats = (label, value) => (
    <div className={clsx(
      'has-background-gray-b border-radius-8px p-15 is-full-width is-flex is-flex-direction-column is-justify-content-space-between',
    )}>
      <p className={clsx('is-size-8 has-text-weight-semibold has-text-stat is-uppercase', styles['stat-title'])}>{label}</p>
      <p className="is-size-4 has-text-weight-semibold has-text-black">{value}</p>
    </div>
  );

  return (
    <div className={clsx('p-10 is-flex is-flex-grow-1 is-clickable', styles.card)} onClick={onClickRepo} aria-hidden>
      <div className="box has-background-white is-full-width p-0 border-radius-2px is-clipped is-flex is-flex-direction-column">
        <div className="has-background-gray-300 is-flex is-justify-content-space-between p-12 is-align-items-center">
          <p className="has-text-black-2 has-text-weight-semibold is-size-5">{name}</p>
          <RepoUsers users={users} />
        </div>
        <div className="is-flex-grow-1 is-flex is-flex-direction-column is-justify-content-space-between">
          <div className="px-12 is-flex is-justify-content-space-between is-flex-wrap-wrap">
            {Object.keys(statLabels).map((item, i) => (
              <div className={clsx('my-12 is-flex', styles.stat)} key={i}>
                {renderStats(statLabels[item], stats?.[item])}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Repos model isn't currently updated in RepoType
// RepoCard.propTypes = RepoType;

export default RepoCard;
