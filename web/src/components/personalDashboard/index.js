import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Metrics from '../metrics';
import RepoCard from '../repos/repoCard';
import TeamCreatePanel from './teamCreatePanel';
import { PATHS } from '../../utils/constants';
import styles from "./personalDashboard.module.scss";
import clsx from 'clsx';

const MAX_REPOS = 6;

const PersonalDashboard = ({ metrics, repos }) => {
  const router = useRouter();

  return (
    <>
      <div className="mt-50 mb-30 column">
        <Metrics
          isLastThirtyDays={false}
          metrics={metrics?.metrics}
          totalMetrics={{
            pullRequests: metrics?.totalMetrics?.smartCodeReviews ?? 0,
            comments: metrics?.totalMetrics?.smartComments ?? 0,
            commenters: metrics?.totalMetrics?.smartCommenters ?? 0,
            users: metrics?.totalMetrics?.semaUsers ?? 0,
          }}
        />
      </div>
      <div className='is-flex is-align-items-center is-justify-content-space-between'>
        <p className="has-text-black-950 has-text-weight-semibold is-size-4 px-15">Recent Repos</p>
        <button className={clsx('button has-text-blue-700 is-ghost is-pulled-right has-text-weight-semibold', !repos?.other?.length > 0 ? styles.btnDisabled : '')} disabled={!repos?.other?.length > 0} onClick={() => router.push(`${PATHS.DASHBOARD}`)}>View All</button>
      </div>
      {repos?.other?.length > 0 && <div className="is-flex is-flex-wrap-wrap is-align-content-stretch">
        {repos.other.slice(0, MAX_REPOS).map((child, i) => (
          <RepoCard {...child} isOrgaizationView key={`card-${i}`} column={3} />
        ))}
      </div>}
      {!repos?.other?.length > 0 && <div class="column">
        <div className={clsx('is-flex is-flex-wrap-wrap is-align-content-stretch is-flex-direction-column is-justify-content-center is-align-items-center', styles.repoContainer)}>
          <p className="has-text-black-950 has-text-weight-semibold is-size-4 px-15">No Repos Yet!</p>
          <p>Add your first repos</p>
        </div>
      </div>}
      <div class="column">
        <TeamCreatePanel />
      </div>
    </>
  )
}

export default PersonalDashboard;
