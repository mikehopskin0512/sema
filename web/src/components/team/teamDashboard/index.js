import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import clsx from 'clsx'
import styles from './teamDashboard.module.scss'
import MetricsCard from '../metricsCard';
import RepoCard from '../../repos/repoCard';
import MinimalTeamTable from '../minimalTeamTable';
import { PATHS, SEMA_CORPORATE_TEAM_ID } from '../../../utils/constants';
import usePermission from '../../../hooks/usePermission';
import { PlusIcon } from '../../Icons';

const TeamDashboard = ({ metrics, members, repos }) => {
  const router = useRouter();
  const { checkAccess } = usePermission();
  const {
    query: { teamId },
  } = useRouter();
  const [teamMetrics, setTeamMetrics] = useState([
    { key: 'smartCodeReviews', title: 'smart code reviews', value: 0, tooltip: 'Smart code review is a pull request that is reviewed uses Sema product' },
    { key: 'smartComments', title: 'smart comments', value: 0, tooltip: 'Smart Comment is a part of Smart Code Review' },
    { key: 'smartCommenters', title: 'smart commenters', value: 0, tooltip: 'Smart commenter is a reviewer that uses Sema' },
    { key: 'semaUsers', title: 'sema users', value: 0, tooltip: 'Sema user is a code reviewer who uses Sema, or a code author that has a Sema account' },
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
          {/* <button class="button is-ghost is-pulled-right has-text-weight-semibold" onClick={() => router.push('')}>View All</button> */}
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
            <button class="button has-text-blue-700 is-ghost is-pulled-right has-text-weight-semibold" onClick={() => router.push(`${PATHS.TEAM._}/${teamId}/${PATHS.REPOS}`)}>View All</button>
          </div>
          <div className="is-flex is-flex-wrap-wrap is-align-content-stretch">
            {repos.map((child, i) => (
              <RepoCard {...child} key={`card-${i}`} column={2} />
            ))}
          </div>
        </div>
        <div className="column is-4">
          <div className='is-flex is-align-items-center is-justify-content-space-between mb-10'>
            <p className="has-text-deep-black has-text-weight-semibold is-size-4 px-15">Team Members</p>
            {checkAccess(SEMA_CORPORATE_TEAM_ID, 'canEditUsers') &&
              <>
                <button class="button has-text-blue-700 is-ghost is-pulled-right has-text-weight-semibold" onClick={() => router.push(`${PATHS.TEAM.INVITE}`)}>
                  <div className="mr-5 is-flex is-align-items-center">
                    <PlusIcon size="small" />
                  </div>
                  Invite new members
                </button>
              </>
            }
          </div>
          <MinimalTeamTable members={members} />
        </div>
      </div>
    </>
  )
}

export default TeamDashboard;
