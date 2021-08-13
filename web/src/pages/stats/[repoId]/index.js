/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/named */
import React, { useEffect } from 'react';
import { format, subDays, subYears } from 'date-fns';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import styles from './stats.module.scss';
import BarChart from '../../../components/BarChart';
import CircularPacking from '../../../components/CircularPackingChart';
import RepoPageLayout from '../../../components/repos/repoPageLayout';
import Helmet, { RepoStatsHelmet } from '../../../components/utils/Helmet';
import { repositoriesOperations } from '../../../state/features/repositories';

// import CalendarPopover from '../../../components/calendarPopover';

const { fetchReactionStats, fetchTagStats } = repositoriesOperations;

const Stats = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { auth, repositories } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
  }));

  const { data: { reactions, tags } } = repositories;
  const { query: { repoId } } = router;

  const getReactions = async () => {
    const reactionFilter = {
      externalId: repoId,
      dateTo: format(new Date(), 'dd MMM, yyyy'),
      dateFrom: format(subDays(new Date(), 8), 'dd MMM yyyy'),
    };
    const tagFilter = {
      externalId: repoId,
      dateTo: format(new Date(), 'dd MMM, yyyy'),
      dateFrom: format(subYears(new Date(), 10), 'dd MMM yyyy'),
    };
    await dispatch(fetchReactionStats(reactionFilter, auth.token));
    await dispatch(fetchTagStats(tagFilter, auth.token));
  };

  useEffect(() => {
    getReactions();
  }, []);

  return (
    <RepoPageLayout>
      <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap px-10">
        <Helmet {...RepoStatsHelmet} />
        <p className="has-text-deep-black has-text-weight-semibold is-size-4">Repo Stats</p>
        {/* <CalendarPopover setDate={setDate} /> */}
      </div>
      <div className="is-flex is-flex-wrap-wrap mt-20">
        <div className={clsx('is-flex-grow-1 px-10 mb-20', styles.containers)}>
          <div className={clsx('has-background-white border-radius-2px p-15', styles.shadow)}>
            <p className="has-text-deep-black has-text-weight-semibold">Reactions (Last 7 Days)</p>
            <BarChart data={reactions || []} />
          </div>
        </div>
        <div className={clsx('is-flex-grow-1 px-10 mb-20', styles.containers)}>
          <div className={clsx('has-background-white border-radius-2px p-15', styles.shadow)}>
            <p className="has-text-deep-black has-text-weight-semibold">Tags (All Time)</p>
            <CircularPacking data={tags || {}} />
          </div>
        </div>
      </div>
    </RepoPageLayout>
  );
};

export default Stats;
