import React from 'react';
import clsx from 'clsx';
import { isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import styles from './repoCard.module.scss';
import { RepoType } from '../repoList/types';

const statLabels = {
  codeReview: 'Smart Code Reviews',
  comments: 'Smart Comments',
  commenters: 'Smart Commenters',
  semaUsers: 'Sema User',
};

const descriptionMaxLength = 170;

// WILL DELETE TEST DATA WHEN API IS COMPLETED
const users = [
  {
    imgUrl: 'https://randomuser.me/api/portraits/men/34.jpg',
  },
  {
    imgUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    imgUrl: 'https://randomuser.me/api/portraits/women/29.jpg',
  },
  {
    imgUrl: 'https://randomuser.me/api/portraits/men/90.jpg',
  },
  {
    imgUrl: 'https://randomuser.me/api/portraits/men/90.jpg',
  },
  {
    imgUrl: 'https://randomuser.me/api/portraits/men/90.jpg',
  },
  {
    imgUrl: 'https://randomuser.me/api/portraits/men/90.jpg',
  },
];

const stats = {
  codeReview: 4,
  comments: 29,
  commenters: 3,
  semaUsers: 3,
};

const RepoCard = (props) => {
  const {
    name, description, isFavorite,
  } = props;

  const truncateText = (text) => {
    if (isEmpty(text)) {
      return 'No description';
    }
    let truncated = text;
    if (text.length > descriptionMaxLength) {
      truncated = `${text.substr(0, descriptionMaxLength)}...`;
    }
    return truncated;
  };

  const renderStats = (label, value) => (
    <div className={clsx(
      'has-background-gray-b border-radius-8px p-15 is-full-width is-flex is-flex-direction-column is-justify-content-space-between',
    )}>
      <p className={clsx('is-size-9 has-text-weight-semibold has-text-stat is-uppercase')}>{label}</p>
      <p className="is-size-4 has-text-weight-semibold has-text-black">{value}</p>
    </div>
  );

  const renderUsers = () => (
    <div className="is-flex">
      {(users.length > 4 ? users.slice(0, 3) : users.slice(0, 4)).map((item) => (
        <figure className="image is-32x32 ml-neg8">
          <img src={item.imgUrl} alt="user" className={clsx('is-rounded', styles.avatar)} />
        </figure>
      ))}
      {users.length > 4 && (
        <div className={clsx(
          'is-fullwidth is-full-height has-background-white border-radius-16px is-flex is-align-items-center is-justify-content-center ml-neg8',
          styles['user-count'],
        )}>
          <p className="is-size-8 has-text-weight-semibold">+{users.length - 3}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className={clsx('p-10 is-flex is-flex-grow-1', styles.card)}>
      <div className="box has-background-white is-full-width p-0 border-radius-2px is-clipped is-flex is-flex-direction-column">
        <div className="has-background-gray-300 is-flex is-justify-content-space-between p-12 is-align-items-center">
          <p className="has-text-black-2 has-text-weight-semibold is-size-5">{name}</p>
          <FontAwesomeIcon icon={isFavorite ? faStarSolid : faStar} size="lg" color={isFavorite ? '#FFA20F' : '#192129'} />
        </div>
        <div className="is-flex-grow-1 is-flex is-flex-direction-column is-justify-content-space-between">
          <div className="px-12 py-15 is-flex is-justify-content-space-between is-align-items-center">
            <p className={clsx('is-size-7 is-clipped is-fullwidth mr-20')}>{truncateText(description)}</p>
            {renderUsers()}
          </div>
          <div className="px-12 is-flex is-justify-content-space-between is-flex-wrap-wrap">
            {Object.keys(stats).map((item) => (
              <div className={clsx('my-12 is-flex', styles.stat)}>
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
