import React from 'react';
import withLayout from '../../components/layout';
import RepoList from '../../components/repos/repoList';

const Dashboard = () => {
  console.log('hehe');

  return (
    <div className="has-background-gray-9 py-50 px-80">
      <RepoList />
    </div>
  );
};

export default withLayout(Dashboard);
