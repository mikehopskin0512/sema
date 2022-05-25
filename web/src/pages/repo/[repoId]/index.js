import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { findIndex, isEmpty, uniqBy } from 'lodash';
import ActivityPage from '../../../components/activity/page';
import RepoPageLayout from '../../../components/repos/repoPageLayout';
import StatsPage from '../../../components/stats';
import Helmet from '../../../components/utils/Helmet';
import { repositoriesOperations } from '../../../state/features/repositories';
import { teamsOperations } from '../../../state/features/teams';
import { getDateSub } from '../../../utils/parsing';
import useAuthEffect from '../../../hooks/useAuthEffect';
import FilterBar from '../../../components/repos/repoPageLayout/components/FilterBar';
import Metrics from '../../../components/metrics';
import { DEFAULT_AVATAR } from '../../../utils/constants';
import styles from './styles.module.scss';

const { fetchRepositoryOverview, fetchReposByIds } = repositoriesOperations;
const { fetchTeamRepos } = teamsOperations;

const tabTitle = {
  activity: 'Activity Log',
  stats: 'Repo Stats',
};

function RepoPage() {
  const dispatch = useDispatch();

  const { auth, repositories } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
  }));
  const { token, selectedTeam } = auth;
  const {
    data: { overview },
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
  });
  const [filterUserList, setFilterUserList] = useState([]);
  const [filterRequesterList, setFilterRequesterList] = useState([]);
  const [filterPRList, setFilterPRList] = useState([]);
  const [isTeamRepo, setIsTeamRepo] = useState(!isEmpty(selectedTeam));

  useEffect(() => {
    setIsTeamRepo(!isEmpty(selectedTeam));
  }, [selectedTeam]);

  useAuthEffect(() => {
    if (!isEmpty(selectedTeam)) {
      dispatch(fetchTeamRepos({ teamId: selectedTeam.team._id }, token));
    }
  }, []);

  useAuthEffect(() => {
    if (isTeamRepo) {
      const { repos } = selectedTeam.team;
      if (repos?.length) {
        const idsParamString = repos.join('-');
        dispatch(fetchReposByIds(idsParamString, token));
      }
    }
  }, []);

  useAuthEffect(() => {
    setIsLoading(true);
    if (
      (dates.startDate && dates.endDate) ||
      (!dates.startDate && !dates.endDate)
    ) {
      dispatch(
        fetchRepositoryOverview(
          repoId,
          token,
          dates.startDate && dates.endDate
            ? getDateSub(dates.startDate, dates.endDate)
            : null
        )
      );
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

  useEffect(() => {
    if (!overview?.smartcomments?.length) {
      return;
    }
    const requesters = overview.smartcomments
      .filter((item) => item.githubMetadata.requester)
      .map(({ githubMetadata }) => ({
        label: githubMetadata.requester,
        value: githubMetadata.requester,
        img: githubMetadata.requesterAvatarUrl || DEFAULT_AVATAR,
      }));
    const users = overview.smartcomments
      .filter((item) => item.userId)
      .map((item) => {
        const {
          firstName = '',
          lastName = '',
          _id = '',
          avatarUrl = '',
          username = 'User@email.com',
        } = item.userId;
        return {
          label:
            isEmpty(firstName) && isEmpty(lastName)
              ? username.split('@')[0]
              : `${firstName} ${lastName}`,
          value: _id,
          img: avatarUrl || DEFAULT_AVATAR,
        };
      });
    const prs = overview.smartcomments
      .filter((item) => item.githubMetadata)
      .map((item) => {
        const {
          githubMetadata: {
            head,
            title = '',
            pull_number: pullNum = '',
            updated_at: updatedAt,
          },
        } = item;
        const prName = title || head || 'Pull Request';
        return {
          updated_at: new Date(updatedAt),
          label: `${prName} (#${pullNum || '0'})`,
          value: pullNum,
          name: prName,
        };
      });
    const filteredPRs = [];
    prs.forEach((item) => {
      const index = findIndex(filteredPRs, { value: item.value });
      if (index !== -1) {
        if (isEmpty(filteredPRs[index].prName)) {
          filteredPRs[index] = item;
        }
      } else {
        filteredPRs.push(item);
      }
    });
    setFilterRequesterList(uniqBy(requesters, 'value'));
    setFilterUserList(uniqBy(users, 'value'));
    setFilterPRList(filteredPRs);
    setIsLoading(false);
  }, [overview]);

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
      isTeamRepo={isTeamRepo}
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
        />

        <div className={clsx(styles.divider, 'my-20 mx-10')} />

        <Metrics
          isLastThirtyDays
          metrics={overview.metrics}
          totalMetrics={totalMetrics}
        />
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
