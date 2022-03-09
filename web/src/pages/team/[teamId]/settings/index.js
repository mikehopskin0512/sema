import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { TeamDashboardHelmet } from '../../../../components/utils/Helmet';
import withLayout from '../../../../components/layout';
import PageHeader from '../../../../components/pageHeader';
import { teamsOperations } from '../../../../state/features/teams';
import TeamInfo from '../../../../components/team/TeamInfo';
import LabelsManagement from '../../../../components/team/LabelsManagement';
import TeamManagement from '../../../../components/team/TeamManagement';
import usePermission from '../../../../hooks/usePermission';
import { TAB } from '../../../../utils/constants';

const { fetchTeamMembers } = teamsOperations;

const TeamSettings = () => {
  const dispatch = useDispatch();
  const { isTeamAdminOrLibraryEditor } = usePermission();
  const router = useRouter();
  const {
    query: { teamId, tab },
  } = router;

  const { auth, teams } = useSelector(
    (state) => ({
      auth: state.authState,
      teams: state.teamsState
    }),
  );
  const { token, user } = auth;
  const [activeTeam, setActiveTeam] = useState({});

  const setDefaultTag = () => {
    router.push({
      pathname: `/team/${teamId}/settings`,
      query: { tab: 'info' },
    });
  };

  useEffect(() => {
    dispatch(fetchTeamMembers(activeTeam._id, {}, token));
  }, [teamId]);

  useEffect(() => {
    if (teams.teams.length) {
      const team = teams.teams.find(({ team }) => {
        return (team?.url === teamId) || (team?._id === teamId)
      });
      if (team) {
        setActiveTeam(team);
      }
    }
  }, [teams, teamId]);

  useEffect(() => {
    !tab && setDefaultTag();
  }, []);

  const menus = [
    {
      name: 'Team Info',
      path: `/team/${teamId}/settings`,
      tab: TAB.info,
    },
    (isTeamAdminOrLibraryEditor() && {
      name: 'Team Management',
      path: `/team/${teamId}/settings`,
      tab: TAB.management,
    }),
    (isTeamAdminOrLibraryEditor() && {
      name: 'Labels Management',
      path: `/team/${teamId}/settings`,
      tab: TAB.labels,
    }),
  ];

  return (
    <>
      <div className="has-background-gray-200 hero">
        <Helmet {...TeamDashboardHelmet} />
        <div className="hero-body pb-300 px-0">
          <PageHeader menus={menus} userRole={activeTeam} />
          {tab === 'info' && <TeamInfo activeTeam={activeTeam} teams={teams} />}
          {tab === 'management' && <TeamManagement activeTeam={activeTeam} />}
          {tab === 'labels' && <LabelsManagement activeTeam={activeTeam} />}
        </div>
      </div>
    </>
  )
}

export default withLayout(TeamSettings);
