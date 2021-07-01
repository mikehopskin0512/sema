import React, { useEffect, useState } from 'react';
import { chunk } from 'lodash';
import PropTypes from 'prop-types';
import { RepoType } from './types';
import RepoCard from '../repoCard';

const RepoList = ({ title, repos }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const repoChunk = chunk(repos, 3);
    setList(repoChunk);
  }, [repos]);

  return (
    <div className="mb-50">
      <p className="has-text-deep-black has-text-weight-semibold is-size-4 mb-20 px-15">{title}</p>
      {list.map((item) => (
        <div className="is-flex-wrap-wrap is-flex">
          {item.map((child) => (
            <RepoCard {...child} />
          ))}
        </div>
      ))}
    </div>
  );
};

RepoList.defaultProps = {
  repos: [],
};

RepoList.propTypes = {
  title: PropTypes.string.isRequired,
  repos: PropTypes.arrayOf(
    PropTypes.exact(RepoType),
  ),
};

export default RepoList;
