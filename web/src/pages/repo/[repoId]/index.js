import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
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

const RepoPage = () => {
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
  const [dates, setDates] = useState();

  useEffect(() => {
    if (
      (dates?.startDate && dates?.endDate) || (!dates?.startDate && !dates?.endDate)
    ) {
      dispatch(fetchRepositoryOverview(repoId, token, dates?.startDate && dates?.endDate ? {
        startDate: format(new Date(dates.startDate), 'MMM dd, yyyy'),
        endDate: format(new Date(dates.endDate), 'MMM dd, yyyy'),
      } : null));
    }
  }, [dispatch, repoId, token, dates]);

  return (
    <RepoPageLayout
      setSelectedTab={setSelectedTab}
      selectedTab={selectedTab}
    >
      { ({ startDate, endDate }) => {
        useEffect(() => {
          setDates({ startDate, endDate });
        }, [startDate, endDate]);
        return(
          <>
            <Helmet title={`${tabTitle[selectedTab]} - ${overview?.name}`} />
            { selectedTab === 'activity' && <ActivityPage startDate={startDate} endDate={endDate} /> }
            { selectedTab === 'stats' && <StatsPage startDate={startDate} endDate={endDate} /> }
          </>
        )
      }}
    </RepoPageLayout>
  );
};

export default RepoPage;
