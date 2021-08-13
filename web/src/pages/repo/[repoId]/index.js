import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import ActivityPage from '../../../components/activity/page';
import RepoPageLayout from '../../../components/repos/repoPageLayout';
import StatsPage from '../../../components/stats';
import Helmet from '../../../components/utils/Helmet';
import { repositoriesOperations } from '../../../state/features/repositories';

const { fetchRepositoryOverview } = repositoriesOperations;

const tabTitle = {
  activity: 'Activity Log',
  stats: 'Repo Stats'
}

const ActivityLogs = () => {
  const dispatch = useDispatch();
  const { auth, repositories } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
  }));
  const { token } = auth;
  const { data: { overview } } = repositories;

  const {
    query: { repoId },
  } = useRouter();

  const [selectedTab, setSelectedTab] = useState('activity');

  useEffect(() => {
    dispatch(fetchRepositoryOverview(repoId, token));
  }, [dispatch, repoId, token]);

  return (
    <RepoPageLayout
      setSelectedTab={setSelectedTab}
      selectedTab={selectedTab}
    >
      { overview ? (
        <>
          <Helmet title={`${tabTitle[selectedTab]} - ${overview?.name}`} />
          { selectedTab === 'activity' && <ActivityPage /> }
          { selectedTab === 'stats' && <StatsPage /> }
        </>
      ) : null }
    </RepoPageLayout>
  );
};

export default ActivityLogs;
