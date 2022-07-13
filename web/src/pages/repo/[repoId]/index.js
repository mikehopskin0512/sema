import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { isEmpty, uniqBy } from 'lodash';
import RepoSocialCircle from '../../../components/repos/repoSocialCircle';
import ActivityPage from '../../../components/activity/page';
import RepoPageLayout from '../../../components/repos/repoPageLayout';
import StatsPage from '../../../components/stats';
import Helmet from '../../../components/utils/Helmet';
import { repositoriesOperations } from '../../../state/features/repositories';
import { organizationsOperations } from '../../../state/features/organizations[new]';
import { getDateSub } from '../../../utils/parsing';
import useAuthEffect from '../../../hooks/useAuthEffect';
import FilterBar from '../../../components/repos/repoPageLayout/components/FilterBar';
import Metrics from '../../../components/metrics';
import styles from './styles.module.scss';

const { fetchRepositoryOverview, fetchReposByIds, fetchRepoFilters } =
  repositoriesOperations;
const { fetchOrganizationRepos } = organizationsOperations;

const tabTitle = {
  activity: 'Activity Log',
  stats: 'Code Stats',
};

function RepoPage() {
  const dispatch = useDispatch();

  const { auth, repositories } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
  }));
  const { token, selectedOrganization } = auth;
  const {
    data: { overview, filterValues },
  } = repositories;
  const totalMetrics = {
    pullRequests: overview?.repoStats?.smartCodeReviews ?? 0,
    comments: overview?.repoStats?.smartComments ?? 0,
    commenters: overview?.repoStats?.smartCommenters ?? 0,
    users: overview?.repoStats?.semaUsers ?? 0,
  };

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
  const [isLoading, setIsLoading] = useState(false);

  const [filter, setFilter] = useState({
    from: [],
    to: [],
    reactions: [],
    tags: [],
    search: '',
    pr: [],
    dateOption: '',
  });
  const [filterUserList, setFilterUserList] = useState([]);
  const [filterRequesterList, setFilterRequesterList] = useState([]);
  const [filterPRList, setFilterPRList] = useState([]);
  const [isOrganizationRepo, setIsOrganizationRepo] = useState(
    !isEmpty(selectedOrganization)
  );

  useEffect(() => {
    setIsOrganizationRepo(!isEmpty(selectedOrganization));
  }, [selectedOrganization]);

  useAuthEffect(() => {
    if (!isEmpty(selectedOrganization)) {
      dispatch(
        fetchOrganizationRepos(
          { organizationId: selectedOrganization.organization._id },
          token
        )
      );
    }
  }, []);

  useAuthEffect(() => {
    if (isOrganizationRepo) {
      const { repos } = selectedOrganization.organization;
      if (repos?.length) {
        const idsParamString = repos.join('-');
        dispatch(fetchReposByIds(idsParamString, token));
      }
    }
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      if (
        (dates.startDate && dates.endDate) ||
        (!dates.startDate && !dates.endDate)
      ) {
        await dispatch(fetchRepoFilters(repoId, dates, token));
        await dispatch(
          fetchRepositoryOverview(
            repoId,
            token,
            dates.startDate && dates.endDate
              ? getDateSub(dates.startDate, dates.endDate)
              : null
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [repoId, dates, dispatch, token]);

  useAuthEffect(() => {
    refresh();
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

  useEffect(() => {
    if (!overview?.smartcomments?.length) {
      return;
    }
    const { pullRequests, requesters, authors } = filterValues;
    setFilterRequesterList(uniqBy(requesters, 'value'));
    setFilterUserList(uniqBy(authors, 'value'));
    setFilterPRList(pullRequests);
    setIsLoading(false);
  }, [overview, filterValues]);

  const onDateChange = ({ startDate: newStartDate, endDate: newEndDate }) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const onChangeFilter = (type, value) => {
    setFilter({
      ...filter,
      [type]: value,
    });
  };

  return (
    <RepoPageLayout
      setSelectedTab={setSelectedTab}
      selectedTab={selectedTab}
      dates={dates}
      onDateChange={onDateChange}
      isOrganizationRepo={isOrganizationRepo}
      refresh={refresh}
    >
      <Helmet title={`${tabTitle[selectedTab]} - ${overview?.name}`} />

      <div className={styles.wrapper}>
        <div className="mb-32 px-8">
          <RepoSocialCircle repoId={repoId} />
        </div>
        <FilterBar
          filter={filter}
          startDate={startDate}
          endDate={endDate}
          filterUserList={filterUserList}
          filterRequesterList={filterRequesterList}
          filterPRList={filterPRList}
          onChangeFilter={onChangeFilter}
          onDateChange={onDateChange}
          tab={selectedTab}
        />

        <div className={clsx(styles.divider, 'my-20 mx-10')} />

        <div className="px-8">
          <Metrics
            isLastThirtyDays
            metrics={overview.metrics}
            totalMetrics={totalMetrics}
          />
        </div>
      </div>
      {selectedTab === 'activity' && (
        <ActivityPage startDate={startDate} endDate={endDate} filter={filter} />
      )}
      {selectedTab === 'stats' && (
        <div className={styles.wrapper}>
          <StatsPage
            startDate={startDate}
            endDate={endDate}
            filter={filter}
            isLoading={isLoading}
          />
        </div>
      )}
    </RepoPageLayout>
  );
}

export default RepoPage;
