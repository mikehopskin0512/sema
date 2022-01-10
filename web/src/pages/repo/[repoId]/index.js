import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import ActivityPage from '../../../components/activity/page';
import RepoPageLayout from '../../../components/repos/repoPageLayout';
import StatsPage from '../../../components/stats';
import Helmet from '../../../components/utils/Helmet';
import { repositoriesOperations } from '../../../state/features/repositories';
import { getDateSub } from '../../../utils/parsing';
import useAuthEffect from '../../../hooks/useAuthEffect';

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

  const firstUpdate = useRef(true);
  const [selectedTab, setSelectedTab] = useState('activity');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dates, setDates] = useState({
    startDate,
    endDate,
  });

  useAuthEffect(() => {
    if (
      (dates.startDate && dates.endDate) || (!dates.startDate && !dates.endDate)
    ) {
      dispatch(fetchRepositoryOverview(repoId, token, dates.startDate && dates.endDate ? getDateSub(dates.startDate, dates.endDate) : null));
    }
  }, [repoId, dates]);

  // Prevent from doing multiple calls while user is selecting dates
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

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
      dates={dates}
    >
      <Helmet title={`${tabTitle[selectedTab]} - ${overview?.name}`} />
      { selectedTab === 'activity' && <ActivityPage startDate={startDate} endDate={endDate} onDateChange={onDateChange} /> }
      { selectedTab === 'stats' && <StatsPage startDate={startDate} endDate={endDate} onDateChange={onDateChange} /> }
    </RepoPageLayout>
  );
};

export default RepoPage;
