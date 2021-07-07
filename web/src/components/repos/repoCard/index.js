import React from 'react';
import clsx from 'clsx';
import styles from './repoCard.module.scss';
import { RepoType } from '../repoList/types';

const statLabels = {
  codeReview: 'Smart Code Reviews',
  comments: 'Smart Comments',
  commenters: 'Smart Commenters',
  semaUsers: 'Sema User',
};

const descriptionMaxLength = 300;

const RepoCard = (props) => {
  const {
    name, description, stats, users,
  } = props;

  const truncateText = (text) => {
    let truncated = text;
    if (text.length > descriptionMaxLength) {
      truncated = `${text.substr(0, descriptionMaxLength)}...`;
    }
    return truncated;
  };

  const renderStats = (label, value) => (
    <div className={clsx('is-full-height has-background-gray-b border-radius-4 p-15 is-full-width', styles['box-shadow'])}>
      <p className={clsx('is-size-9 has-text-weight-semibold has-text-stat is-uppercase', styles['stat-label'])}>{label}</p>
      <p className="is-size-4 has-text-weight-semibold has-text-black">{value}</p>
    </div>
  );

  const renderUsers = () => (
    <div className="is-flex">
      {users.slice(0, 3).map((item) => (
        <figure className="image is-32x32 ml--8">
          <img src={item.imgUrl} alt="user" className={clsx('is-rounded', styles.avatar)} />
        </figure>
      ))}
      {users.length > 3 && (
        <figure className="image is-32x32 ml--8">
          <div className={clsx(
            'is-fullwidth is-full-height has-background-white border-radius-16px is-flex is-align-items-center is-justify-content-center',
            styles.avatar,
          )}>
            <p className="has-text-black is-size-8 has-text-weight-semibold">+{users.length - 3}</p>
          </div>
        </figure>
      )}
    </div>
  );

  return (
    <div className={clsx('p-10 is-flex', styles.card)}>
      <div className="box has-background-white is-full-width p-0 border-radius-2px is-clipped is-flex is-flex-direction-column">
        <div className="has-background-gray-3 is-flex is-justify-content-space-between p-12">
          <p className="has-text-black-2 has-text-weight-semibold is-size-5">{name}</p>
        </div>
        <div className="is-flex-grow-1 is-flex is-flex-direction-column is-justify-content-space-between">
          <div className="px-12 py-8 is-flex is-justify-content-space-between">
            <p className={clsx('is-size-7 is-clipped is-fullwidth')}>{truncateText(description)}</p>
            {renderUsers()}
          </div>
          <div className="tile is-ancestor is-12 m-0">
            {Object.keys(stats).map((item) => (
              <div className={clsx('tile is-parent is-3', styles.stat)}>
                {renderStats(statLabels[item], stats[item])}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

RepoCard.propTypes = RepoType;

export default RepoCard;
