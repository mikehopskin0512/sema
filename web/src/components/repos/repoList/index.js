import React from 'react';
import PropTypes from 'prop-types';
import { RepoType } from './types';
import RepoCard from '../repoCard';

const LIST_TYPE = {
  FAVORITES: 'Favorite Repos',
  OTHERS: 'Other Repos',
};

const RepoList = ({ type, repos }) => (
  <div className="mb-50">
    <p className="has-text-deep-black has-text-weight-semibold is-size-4 mb-20 px-15">{LIST_TYPE[type]}</p>
    <div className="is-flex-wrap-wrap is-flex is-align-content-stretch">
      {repos.map((child) => (
        <RepoCard {...child} isFavorite={type === 'FAVORITES'} />
      ))}
    </div>
  </div>
);

RepoList.defaultProps = {
  repos: [],
};

RepoList.propTypes = {
  type: PropTypes.string.isRequired,
  repos: PropTypes.arrayOf(
    PropTypes.exact(RepoType),
  ),
};

export default RepoList;
