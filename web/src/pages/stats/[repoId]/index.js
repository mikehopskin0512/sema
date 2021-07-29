/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/named */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { BarData, CircularData } from '../../../data/stats-repoId';
import styles from './stats.module.scss';
import BarChart from '../../../components/BarChart';
import CircularPacking from '../../../components/CircularPackingChart';
import RepoPageLayout from '../../../components/repos/repoPageLayout';
import Helmet, { RepoStatsHelmet } from '../../../components/utils/Helmet';
import { repositoriesOperations } from '../../../state/features/repositories';

// import CalendarPopover from '../../../components/calendarPopover';

const { fetchRepoStats } = repositoriesOperations;

const Stats = () => {
  const dispatch = useDispatch();

  const { auth } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
  }));

  // const setDate = (dates) => {
  //   alert(`
  //     start: ${dates.startDate.toString()}
  //     end: ${dates.endDate.toString()}
  //   `);
  // };

  const getReactions = async () => {
    const filter = {
      externalId: '293553582',
      dateTo: '2021-07-22 00:00:00',
      dateFrom: '2021-07-10 00:00:00',
    };
    await dispatch(fetchRepoStats(filter, auth.token));
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
            <p className="has-text-deep-black has-text-weight-semibold">Reactions</p>
            <BarChart data={BarData} />
          </div>
        </div>
        <div className={clsx('is-flex-grow-1 px-10 mb-20', styles.containers)}>
          <div className={clsx('has-background-white border-radius-2px p-15', styles.shadow)}>
            <p className="has-text-deep-black has-text-weight-semibold">Tags</p>
            <CircularPacking data={CircularData} />
          </div>
        </div>
      </div>
    </RepoPageLayout>
  );
};

export default Stats;
