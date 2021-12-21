import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash'
import clsx from 'clsx';
import Avatar from 'react-avatar';
import { Helmet } from 'react-helmet';
import { TeamDashboardHelmet } from '../../../../components/utils/Helmet';
import withLayout from '../../../../components/layout';
import PageHeader from '../../../../components/pageHeader';
import { PlusIcon } from '../../../../components/Icons';
import styles from './settings.module.scss';
import { PATHS } from '../../../../utils/constants';
import { teamsOperations } from '../../../../state/features/teams';

const { fetchTeamMembers } = teamsOperations;

const TeamSettings = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    query: { teamId },
  } = useRouter();
  const { auth, teams } = useSelector(
    (state) => ({
      auth: state.authState,
      teams: state.teamsState
    }),
  );
  const { token, user } = auth;

  const [userRole, setUserRole] = useState({});

  useEffect(() => {
    dispatch(fetchTeamMembers(teamId, {} ,token));
  }, [teamId])

  useEffect(() => {
    if (teams.teams.length) {
      const activeRole = _.find(teams.teams, function (o) {
        return o.team._id === teamId
      });
      if (activeRole) {
        setUserRole(activeRole)
      }
    }
  }, [teams]);

  const menus = [
    {
      name: 'Team Info',
      path: '/settings',
      pathname: `${PATHS.TEAM._}/[teamId]/settings`,
    },
  ];

  return (
    <>
      <div className="has-background-gray-200 hero">
        <Helmet {...TeamDashboardHelmet} />
        <div className="hero-body pb-300">
          <PageHeader menus={menus} userRole={userRole} />
          <div className="content-container px-20">
            <div className='is-flex is-align-items-center is-justify-content-space-between'>
              <div className="is-flex is-align-items-center mb-15">
                <Avatar
                  name={userRole?.team?.name || "Team"}
                  src={userRole?.team?.avatarUrl}
                  size="35"
                  round
                  textSizeRatio={2.5}
                  className=""
                  maxInitials={2}
                />
                <p className="has-text-weight-semibold has-text-black-950 is-size-5 ml-20">
                  {userRole?.team?.name}
                </p>
                <span
                  className={clsx('ml-15 p-15 tag is-rounded is-uppercase has-text-weight-semibold is-size-8 is-primary', styles.tag)}
                >
                  {teams.membersCount === 1 ? `${teams.membersCount} member` : `${teams.membersCount} members`}
                </span>
              </div>
              <button class="button is-primary is-outlined is-pulled-right has-text-weight-semibold" onClick={() => router.push(`/team/${teamId}/edit`)}>Edit</button>
            </div>
            <div className={clsx(styles['team-description'], `has-text-gray-800 is-flex is-justify-content-space-between mb-25 is-flex-wrap-wrap`)}>
              <p>{`${userRole?.team?.description || ''}`}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default withLayout(TeamSettings);
