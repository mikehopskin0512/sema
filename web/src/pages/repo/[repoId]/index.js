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
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [dates, setDates] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    if (
      (dates.startDate && dates.endDate) || (!dates.startDate && !dates.endDate)
    ) {
      dispatch(fetchRepositoryOverview(repoId, token, dates.startDate && dates.endDate ? {
        startDate: format(new Date(dates.startDate), 'MMM dd, yyyy'),
        endDate: format(new Date(dates.endDate), 'MMM dd, yyyy'),
      } : null));
    }
  }, [dispatch, repoId, token, dates]);

  // Prevent from doing multiple calls while user is selecting dates
  useEffect(() => {
    if (startDate && endDate) {
      setDates({ startDate, endDate });
    }
    if (!startDate && !endDate) {
      setDates({
        startDate: null,
        endDate: null,
      });
    }
  }, [startDate, endDate]);

  const onDateChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  }

  return (
    <RepoPageLayout
      setSelectedTab={setSelectedTab}
      selectedTab={selectedTab}
    >
      <Helmet title={`${tabTitle[selectedTab]} - ${overview?.name}`} />
      { selectedTab === 'activity' && <ActivityPage startDate={startDate} endDate={endDate} onDateChange={onDateChange} /> }
      { selectedTab === 'stats' && <StatsPage startDate={startDate} endDate={endDate} onDateChange={onDateChange} /> }
    </RepoPageLayout>
  );
};

export default RepoPage;
