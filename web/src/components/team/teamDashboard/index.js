import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import usePermission from '../../../hooks/usePermission';
import MetricsCard from '../metricsCard';
import RepoCard from '../../repos/repoCard';
import MinimalTeamTable from '../minimalTeamTable';
import { PlusIcon } from '../../Icons';
import { PATHS } from '../../../utils/constants';

const MAX_REPOS = 6;

const TeamDashboard = ({ team }) => {
  const { metrics, members, repos, membersCount } = team;
  const router = useRouter();
  const { checkAccess } = usePermission();
  const {
    query: { teamId },
  } = useRouter();
  const [teamMetrics, setTeamMetrics] = useState([
    { key: 'smartCodeReviews', title: 'sema code reviews', value: 0, tooltip: 'Pull Request reviewed using Sema' },
    { key: 'smartComments', title: 'sema comments', value: 0, tooltip: 'Comment made in a Code Review using Sema' },
    { key: 'smartCommenters', title: 'sema commenters', value: 0, tooltip: 'Number of Code Reviewers using Sema' },
    { key: 'semaUsers', title: 'sema users', value: 0, tooltip: 'Number of people with a Sema account' },
  ]);

  useEffect(() => {
    const m = [...teamMetrics];
    const liveMetrics = teamMetrics.map((metric) => {
      metric.value = metrics[metric.key];
      return metric;
    })
    setTeamMetrics(liveMetrics)
  }, [metrics])

  return (
    <>
      <div className="mt-50 mb-30">
        <div className='is-flex is-align-items-center is-justify-content-space-between'>
          <p className="has-text-deep-black has-text-weight-semibold is-size-4 px-15">Metrics</p>
          {/* TODO: If metrics page for teams is added, we would activate this button */}
          {/* <button className="button is-ghost is-pulled-right has-text-weight-semibold" onClick={() => router.push('')}>View All</button> */}
        </div>
        <div className="">
          <div className="mt-20 pb-10 columns m-0">
            {teamMetrics.map(({ title, value, key, tooltip }) => {
              return <MetricsCard key={key} title={title} value={value} tooltip={tooltip}/>
            })}
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column is-8">
          <div className='is-flex is-align-items-center is-justify-content-space-between'>
            <p className="has-text-deep-black has-text-weight-semibold is-size-4 px-15">Recent Repos</p>
            <button className="button has-text-blue-700 is-ghost is-pulled-right has-text-weight-semibold" onClick={() => router.push(`${PATHS.TEAM._}/${teamId}${PATHS.REPOS}`)}>View All</button>
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
              onClick={() => router.push(`${PATHS.TEAM._}/${teamId}`)}
            >
              View All
            </button>
          </div>
          <MinimalTeamTable members={members} count={membersCount} />
        </div>
      </div>
    </>
  )
}

export default TeamDashboard;
