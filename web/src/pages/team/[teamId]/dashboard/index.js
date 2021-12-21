import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { Helmet } from 'react-helmet';
import TeamDashboard from '../../../../components/team/teamDashboard';
import withLayout from '../../../../components/layout';
import { TeamDashboardHelmet } from '../../../../components/utils/Helmet';
import styles from './dashboard.module.scss';
import { teamsOperations } from '../../../../state/features/teams';
import withSelectedTeam from '../../../../components/auth/withSelectedTeam';

const { fetchTeamMembers, fetchTeamMetrics, fetchTeamRepos } = teamsOperations;

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    query: { teamId },
  } = useRouter();
  const { auth, teams } = useSelector(
    (state) => ({
      auth: state.authState,
      teams: state.teamsState
    }),
  );
  const { token } = auth;
  
  useEffect(() => {
    dispatch(fetchTeamMembers(teamId, { page: 1, perPage: 6 }, token));
    dispatch(fetchTeamMetrics(teamId, token));
    dispatch(fetchTeamRepos(teamId, token));
  }, []);

  return (
    <>
      <Helmet title={TeamDashboardHelmet.title} />
      <div className='sema-wide-container'>
        <TeamDashboard metrics={teams.metrics} repos={teams.repos} members={teams.members} />
        <div className='is-flex is-align-items-center is-justify-content-space-between py-40 px-35 mb-50 has-background-blue-0'>
          <div>
            <p className='is-size-4 has-text-weight-semibold'>
              Encourage consistent best practices amongst your team
            </p>
            <p className='is-size-6'>
              Be sure to review and update your suggested comments library. &nbsp;
              <a className='is-text is-underlined'>Tell me more.</a>
            </p>
          </div>
          <button className={clsx('button p-25 is-primary is-outlined colored-shadow-small is-medium', styles.button)}>
            Update Your Team Suggest Comments
          </button>
        </div>
      </div>
    </>
  )
}

export default withSelectedTeam(withLayout(Dashboard))
