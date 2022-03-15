import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { Helmet } from 'react-helmet';
import TeamDashboard from '../../../../components/team/teamDashboard';
import withLayout from '../../../../components/layout';
import { TeamDashboardHelmet } from '../../../../components/utils/Helmet';
import { PATHS, SEMA_FAQ_SLUGS, SEMA_FAQ_URL } from '../../../../utils/constants';
import styles from './dashboard.module.scss';
import { teamsOperations } from '../../../../state/features/teams';
import withSelectedTeam from '../../../../components/auth/withSelectedTeam';

const { fetchTeamMembers, fetchTeamMetrics, fetchTeamRepos } = teamsOperations;

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    push,
    query: { teamId },
  } = useRouter();
  const { auth, teams } = useSelector(
    (state) => ({
      auth: state.authState,
      teams: state.teamsState,
    }),
  );
  const { token } = auth;

  useEffect(() => {
    dispatch(fetchTeamMembers(teamId, { page: 1, perPage: 6 }, token));
    dispatch(fetchTeamMetrics(teamId, token));
    dispatch(fetchTeamRepos(teamId, token));
  }, [dispatch, teamId, token]);

  return (
    <>
      <Helmet title={TeamDashboardHelmet.title} />
      <div className="sema-wide-container">
        <TeamDashboard team={teams} />
        <div className="is-flex is-align-items-center is-justify-content-space-between py-40 px-35 mb-50 has-background-blue-50">
          <div>
            <p className="is-size-4 has-text-weight-semibold">
              Encourage consistent best practices amongst your team
            </p>
            <p className="is-size-6">
              Be sure to review and update your snippets library. &nbsp;
              <a
                target="_blank"
                rel="noreferrer"
                className="is-text"
                href={`${SEMA_FAQ_URL}#${SEMA_FAQ_SLUGS.SNIPPETS}`}
              >
                Tell me more.
              </a>
            </p>
          </div>
          <div className="has-background-white">
            <button
              type="button"
              onClick={() => push(PATHS.SNIPPETS._)}
              className={clsx('button p-25 is-primary is-outlined is-medium', styles.button)}
            >
              Update Your Team Snippets
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default withSelectedTeam(withLayout(Dashboard));
