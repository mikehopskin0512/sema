import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { filter, findIndex, isEmpty, uniqBy } from 'lodash';
import RepoSocialCircle from '../../../components/repos/repoSocialCircle';
import ActivityPage from '../../../components/activity/page';
import RepoPageLayout from '../../../components/repos/repoPageLayout';
import StatsPage from '../../../components/stats';
import Helmet from '../../../components/utils/Helmet';
import { commentsOperations } from '../../../state/features/comments';
import { repositoriesOperations } from '../../../state/features/repositories';
import { organizationsOperations } from '../../../state/features/organizations[new]';
import { getDateSub } from '../../../utils/parsing';
import useAuthEffect from '../../../hooks/useAuthEffect';
import FilterBar from '../../../components/repos/repoPageLayout/components/FilterBar';
import Metrics from '../../../components/metrics';
import styles from './styles.module.scss';
import { useFlags } from '../../../components/launchDarkly';
import { DEFAULT_REPO_OVERVIEW } from '../../../state/features/repositories/reducers';
import { requestFetchRepositoryOverviewSuccess } from '../../../state/features/repositories/actions';
import { format } from 'date-fns';
import { YEAR_MONTH_DAY_FORMAT } from '../../../utils/constants/date';
import { DEFAULT_FILTER_STATE } from '../../../utils/constants/filter';


const { fetchRepositoryOverview, fetchReposByIds, fetchRepoFilters } =
  repositoriesOperations;
const { filterRepoSmartComments } = commentsOperations;
const { fetchOrganizationRepos } = organizationsOperations;

const tabTitle = {
  stats: 'Repo Insights',
  activity: 'Activity Log',
};

function RepoPage() {
  const dispatch = useDispatch();

  const {
    auth,
    repositories,
  } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
  }));
  const {
    token,
    selectedOrganization,
  } = auth;
  const {
    data: {
      overview,
      filterValues,
    },
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
  const [selectedTab, setSelectedTab] = useState('stats');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dates, setDates] = useState({
    startDate,
    endDate,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialRefresh, setIsInitialRefresh] = useState(true);

  const [filter, setFilter] = useState(DEFAULT_FILTER_STATE);
  const [isOrganizationRepo, setIsOrganizationRepo] = useState(
    !isEmpty(selectedOrganization)
  );

  useEffect(() => {
    setFilter(DEFAULT_FILTER_STATE);
  }, [selectedTab]);

  useEffect(() => {
    setIsOrganizationRepo(!isEmpty(selectedOrganization));

    return () => {
      dispatch(requestFetchRepositoryOverviewSuccess(DEFAULT_REPO_OVERVIEW));
    };
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

  const searchSmartComments = useCallback((filterData) => {
    const repo = filterValues.repos.find((o) => o.externalId === repoId)
    if (!repo) return;
    const filter = {
      ...getDateSub(dates.startDate, dates.endDate),
      fromUserList: filterData.from.map((f) => (f.value)),
      toUserList: filterData.to.map((t) => (t.value)),
      summaries: filterData.reactions.map((r) => (r.value)),
      tags: filterData.tags.map((t) => (t.value)),
      pullRequests: filterData.pr.map((p) => (p.value)),
      searchQuery: filterData.search,
      pageNumber: filterData.pageNumber,
      pageSize: filterData.pageSize,
      repoIds: [repo.value]
    }
    dispatch(
      filterRepoSmartComments(
        token,
        filter
      )
    )
  }, [token, filterValues, dates]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      if (
        (dates.startDate && dates.endDate) ||
        (!dates.startDate && !dates.endDate)
      ) {
          dispatch(fetchRepoFilters(repoId, dates, token, true));
          await Promise.all([
            dispatch(
              fetchRepositoryOverview(
                repoId,
                token,
                dates.startDate && dates.endDate
                  ? getDateSub(dates.startDate, dates.endDate)
                  : null,
                true
              )
            ),
            searchSmartComments(filter)
          ]);
        }
    } finally {
      setIsLoading(false);
      setIsInitialRefresh(false);
    }
  }, [repoId, dates, dispatch, token, filter]);

  useAuthEffect(() => {
    refresh();
  }, [repoId, dates, filter]);

  // Prevent from doing multiple calls while user is selecting dates
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (startDate && endDate) {
      setDates({
        startDate,
        endDate,
      });
    }
    if (!startDate && !endDate) {
      setDates({
        startDate: null,
        endDate: null,
      });
    }
  }, [startDate, endDate]);

  const onDateChange = ({
    startDate: newStartDate,
    endDate: newEndDate,
  }) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    const formatDate = (date) =>
      date ? format(new Date(date), YEAR_MONTH_DAY_FORMAT) : null;
    setFilter({
      ...filter,
      startDate: formatDate(newStartDate),
      endDate: formatDate(newEndDate),
    });
  };

  const onChangeFilter = (type, value) => {
    setFilter({
      ...filter,
      [type]: value,
    });
  };

  const { socialCircles } = useFlags();

  const isSocialCyclesShown = socialCircles && selectedTab === 'stats';

  return (
    <RepoPageLayout
      setSelectedTab={setSelectedTab}
      selectedTab={selectedTab}
      dates={dates}
      onDateChange={onDateChange}
      isOrganizationRepo={isOrganizationRepo}
      refresh={refresh}
      isLoading={isLoading}
    >
      <Helmet title={`${tabTitle[selectedTab]} - ${overview?.name}`} />
      <div className={styles.wrapper}>
        {isSocialCyclesShown && (
          <div className="mb-32 px-8">
            <RepoSocialCircle repoId={repoId} isLoading={repositories.isFetching || isInitialRefresh} />
          </div>
        )}
        <FilterBar
          filter={filter}
          startDate={startDate}
          endDate={endDate}
          onChangeFilter={onChangeFilter}
          onDateChange={onDateChange}
          tab={selectedTab}
          onSearch={(search) => searchSmartComments({ ...filter, search })}
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
        <ActivityPage startDate={startDate} endDate={endDate} filter={filter} setFilter={setFilter} />
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
