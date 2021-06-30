import React from 'react';
import RepoCard from '../repoCard';

const RepoList = () => (
  <div>
    <div className="tile is-ancestor is-12">
      <div className="tile is-parent is-4">
        <RepoCard />
      </div>
      <div className="tile is-parent is-4">
        <RepoCard />
      </div>
      <div className="tile is-parent is-4">
        <RepoCard />
      </div>
    </div>
    <div className="tile is-ancestor is-12">
      <div className="tile is-parent is-4">
        <RepoCard />
      </div>
      <div className="tile is-parent is-4">
        <RepoCard />
      </div>
      <div className="tile is-parent is-4">
        <RepoCard />
      </div>
    </div>
  </div>
);

export default RepoList;
