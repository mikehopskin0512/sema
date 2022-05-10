import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import usePermission from '../../../hooks/usePermission';
import Metrics from '../../metrics';
import RepoCard from '../../repos/repoCard';
import MinimalTeamTable from '../minimalTeamTable';
import { PATHS, TAB } from '../../../utils/constants';
import styles from "./teamDashboard.module.scss";

const MAX_REPOS = 6;

const TeamDashboard = ({ team }) => {
  const { metrics, members, repos, membersCount } = team;
  const router = useRouter();
  const { checkAccess } = usePermission();
  const {
    query: { teamId },
  } = useRouter();

  return (
    <>
      <div className="mt-50 mb-30">
        <Metrics
          isLastThirtyDays={true}
          metrics={metrics?.metrics}
          totalMetrics={{
            pullRequests: metrics?.totalMetrics?.smartCodeReviews ?? 0,
            comments: metrics?.totalMetrics?.smartComments ?? 0,
            commenters: metrics?.totalMetrics?.smartCommenters ?? 0,
            users: metrics?.totalMetrics?.semaUsers ?? 0,
          }}
        />
      </div>
      <div className="columns">
        <div className="column is-8">
          <div className='is-flex is-align-items-center is-justify-content-space-between'>
            <p className="has-text-deep-black has-text-weight-semibold is-size-4 px-15">Recent Repos</p>
            <button className="button has-text-blue-700 is-ghost is-pulled-right has-text-weight-semibold" onClick={() => router.push(`${PATHS.TEAMS._}/${teamId}${PATHS.REPOS}`)}>View All</button>
          </div>
          <div className="is-flex is-flex-wrap-wrap is-align-content-stretch">
            {repos.slice(0, MAX_REPOS).map((child, i) => (
              <RepoCard {...child} isTeamView key={`card-${i}`} column={2} />
            ))}
          </div>
        </div>
        <div className="column is-4">
          <div className="is-flex is-align-items-center is-justify-content-space-between mb-10">
            <p className="has-text-deep-black has-text-weight-semibold is-size-4 px-15">Team Members</p>
            <button
              className="button has-text-blue-700 is-ghost is-pulled-right has-text-weight-semibold"
              onClick={() => router.push(`${PATHS.TEAMS._}/${teamId}${PATHS.SETTINGS}?tab=${TAB.management}`)}
            >
              View All
            </button>
          </div>
          <MinimalTeamTable members={members} count={membersCount} teamId={teamId} />
        </div>
      </div>
    </>
  )
}

export default TeamDashboard;
