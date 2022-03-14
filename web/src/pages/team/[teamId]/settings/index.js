import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { TeamDashboardHelmet } from '../../../../components/utils/Helmet';
import withLayout from '../../../../components/layout';
import PageHeader from '../../../../components/pageHeader';
import { teamsOperations } from '../../../../state/features/teams';
import LabelsManagement from '../../../../components/team/LabelsManagement';
import TeamManagement from '../../../../components/team/TeamManagement';
import usePermission from '../../../../hooks/usePermission';
import { TAB } from '../../../../utils/constants';
import { TagIcon, TeamIcon } from '../../../../components/Icons';

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
  
  useEffect(() => {
    dispatch(fetchTeamMembers(teamId, {}, token));
  }, [teamId]);

  const setDefaultTag = () => {
    router.push({
      pathname: `/team/${teamId}/settings`,
      query: { tab: TAB.management },
    });
  };

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
    (isTeamAdminOrLibraryEditor() && {
      name: 'Team Management',
      path: `/team/${teamId}/settings`,
      tab: TAB.management,
      icon: <TeamIcon width={20} />,
    }),
    (isTeamAdminOrLibraryEditor() && {
      name: 'Labels Management',
      path: `/team/${teamId}/settings`,
      tab: TAB.labels,
      icon: <TagIcon />,
    }),
  ];

  return (
    <>
      <div className="has-background-white">
        <div className="container pt-40">
          <Helmet {...TeamDashboardHelmet} />
          <PageHeader menus={menus} userRole={activeTeam} />
        </div>
      </div>
      <div className="container">
        <div className="has-background-white-50">
          <div className="hero-body pt-0 pb-100 px-0">
            {tab === 'management' && <TeamManagement activeTeam={activeTeam}/>}
            {tab === 'labels' && <LabelsManagement activeTeam={activeTeam}/>}
          </div>
        </div>
      </div>
    </>
  )
}

export default withLayout(TeamSettings);
