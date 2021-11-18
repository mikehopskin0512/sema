import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBorderAll } from '@fortawesome/free-solid-svg-icons';
import { RepoType } from './types';
import RepoCard from '../repoCard';
import RepoTable from '../repoTable';

const LIST_TYPE = {
  FAVORITES: 'Favorite Repos',
  MY_REPOS: 'My Repos',
};

const RepoList = ({ type, repos }) => {
  const [view, setView] = useState('grid');

  return (
    repos.length > 0 ? (
      <div className="mb-50">
        <div className="is-flex is-justify-content-space-between">
          <p className="has-text-black-950 has-text-weight-semibold is-size-4 mb-20 px-15">{LIST_TYPE[type]}</p>
          <div className="is-flex">
            <button className={clsx("button border-radius-0 is-small", view === 'list' ? 'is-primary' : '')} onClick={() => setView('list')}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            <button className={clsx("button border-radius-0 is-small", view === 'grid' ? 'is-primary' : '')} onClick={() => setView('grid')}>
              <FontAwesomeIcon icon={faBorderAll} />
            </button>
          </div>
        </div>
        { view === 'grid' ? (
          <div className="is-flex is-flex-wrap-wrap is-align-content-stretch">
            {repos.map((child, i) => (
              <RepoCard {...child} isFavorite={type === 'FAVORITES'} key={i} />
            ))}
          </div>
        ) : null }
        { view === 'list' ? (
          <RepoTable data={repos} />
        ) : null }
      </div>
    ) : null
  )
};

RepoList.defaultProps = {
  repos: [],
};

RepoList.propTypes = {
  type: PropTypes.string.isRequired,
  // Repos model isn't currently updated in RepoType
  // repos: PropTypes.arrayOf(
  //  PropTypes.exact(RepoType),
  //),
};

export default RepoList;
