import React, { useRef, useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { filter, findIndex, isEmpty, uniqBy } from 'lodash';
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
import { DEFAULT_AVATAR } from '../../../utils/constants';
import styles from './styles.module.scss';
import * as api from '../../../state/utils/api';

const { fetchRepositoryOverview, fetchReposByIds, fetchRepoFilters } =
  repositoriesOperations;
const { filterRepoSmartComments } = commentsOperations;
const { fetchOrganizationRepos } = organizationsOperations;

const tabTitle = {
  activity: 'Activity Log',
  stats: 'Code Stats',
  sync: 'Sync',
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
    pullRequests: overview.repoStats?.smartCodeReviews ?? 0,
    comments: overview.repoStats?.smartComments ?? 0,
    commenters: overview.repoStats?.smartCommenters ?? 0,
    users: overview.repoStats?.semaUsers ?? 0,
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
    pageNumber: 1,
    pageSize: 10
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

  const searchSmartComments = (filterData) => {
    const filter = {
      ...getDateSub(dates.startDate, dates.endDate),
      fromUserList: filterData.from.map((f) => (f.value)),
      toUserList: filterData.to.map((t) => (t.value)),
      summaries: filterData.reactions.map((r) => (r.value)),
      tags: filterData.tags.map((t) => (t.value)),
      pullRequests: filterData.pr.map((p) => (p.value)),
      searchQuery: filterData.search,
      pageNumber: filterData.pageNumber,
      pageSize: filterData.pageSize
    }
    dispatch(
      filterRepoSmartComments(
        repoId,
        token,
        filter
      )
    )
  };

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      if (
        (dates.startDate && dates.endDate) ||
        (!dates.startDate && !dates.endDate)
      ) {
          dispatch(fetchRepoFilters(repoId, dates, token));
          await Promise.all([
            dispatch(
              fetchRepositoryOverview(
                repoId,
                token,
                dates.startDate && dates.endDate
                  ? getDateSub(dates.startDate, dates.endDate)
                  : null
              )
            ),
            searchSmartComments(filter)
          ]);
        }
    } finally {
      setIsLoading(false);
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
    >
      <Helmet title={`${tabTitle[selectedTab]} - ${overview?.name}`} />

      <div className={styles.wrapper}>
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
          onSearch={(search) => searchSmartComments({ ...filter, search })}
        />

        <div className={clsx(styles.divider, 'my-20 mx-10')} />

        <Metrics
          isLastThirtyDays
          metrics={overview.metrics}
          totalMetrics={totalMetrics}
        />
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
      {selectedTab === 'sync' && (
        <div className={styles.wrapper}>
          <SyncPage refresh={refresh} />
        </div>
      )}
    </RepoPageLayout>
  );
}

function SyncPage({ refresh }) {
  const { token } = useSelector((state) => state.authState);
  const { repositories } = useSelector((state) => ({
    repositories: state.repositoriesState,
  }));

  const {
    data: { overview },
  } = repositories;

  const { _id } = overview;
  const sync = overview.sync || {};

  async function onClick() {
    await api.create(`/api/proxy/repositories/${_id}/sync`, {}, token);
  }

  useEffect(() => {
    const id = setInterval(refresh, 5000);
    return () => {
      clearInterval(id);
    };
  }, [refresh]);

  return (
    <div className="my-20">
      <h2 className="has-text-black-950 has-text-weight-semibold is-size-4">
        Sync
      </h2>
      <div className="my-10">
        Status: {sync.status || 'not requested'}
        {sync.startedAt && (
          <>
            <br />
            Started: {format(new Date(sync.startedAt), 'MMM dd h:mm a')}
          </>
        )}
        {sync.completedAt && (
          <>
            <br />
            Completed: {format(new Date(sync.completedAt), 'MMM dd h:mm a')}
          </>
        )}
        {sync.erroredAt && (
          <>
            <br />
            Errored: {format(new Date(sync.erroredAt), 'MMM dd h:mm a')}
            <br />
            Error Message: {sync.error || 'N/A'}
          </>
        )}
        {sync.status === 'unauthorized' && (
          <div className="my-10">
            <a
              type="button"
              className="button is-primary"
              href={`https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_NAME}/installations/new`}
            >
              Install the Sema app
            </a>
          </div>
        )}
      </div>
      <div className="my-10">
        <h3 className="is-size-5">Progress</h3>
        Conversation comments (issue comments):{' '}
        {sync.progress?.issueComment?.currentPage ?? 0}/
        {sync.progress?.issueComment?.lastPage ?? 0} pages
        <br />
        Inline comments (pull request comments):{' '}
        {sync.progress?.pullRequestComment?.currentPage ?? 0}/
        {sync.progress?.pullRequestComment?.lastPage ?? 0} pages
        <br />
        Review comments (pull request reviews):{' '}
        {sync.progress?.pullRequestReview?.currentPage ?? 0}/
        {sync.progress?.pullRequestReview?.lastPage ?? 0} pages
      </div>
      <div className="my-20">
        <div className="my-10">
          <button className="button is-primary" onClick={onClick}>
            Start Sync
          </button>
        </div>
        Starting sync after complete will re-sync.
      </div>
    </div>
  );
}

export default RepoPage;
