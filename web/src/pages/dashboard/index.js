import React from 'react';
import withLayout from '../../components/layout';
import RepoList from '../../components/repos/repoList';

import { favorites, repos } from './data';

const Dashboard = () => {
  const renderRepos = () => (
    <>
      <RepoList title="Favorite Repos" repos={favorites} />
      <RepoList title="Other Repos" repos={repos} />
    </>
  );

  return (
    <div className="has-background-gray-9 ">
      <div className="py-30 px-80 is-hidden-mobile">
        {renderRepos()}
      </div>
      <div className="p-25 is-hidden-desktop">
        {renderRepos()}
      </div>
      <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-fullwidth mb-80">
        <button className="button has-background-gray-9 is-outlined has-text-black-2 has-text-weight-semibold is-size-6" type="button">View More</button>
        <p className="has-text-weight-semibold has-text-gray-dark mt-25">30 other repos with no smart comments yet</p>
      </div>
    </div>
  );
};

export default withLayout(Dashboard);
