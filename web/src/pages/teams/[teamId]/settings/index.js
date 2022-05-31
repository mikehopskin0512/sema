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
import {PATHS, SEMA_CORPORATE_TEAM_ID, TAB} from '../../../../utils/constants';
import { TagIcon, TeamIcon } from '../../../../components/Icons';

const { fetchTeamMembers } = teamsOperations;

const TeamSettings = () => {
  const dispatch = useDispatch();
  const { isTeamAdminOrLibraryEditor, checkAccess } = usePermission();
  const isSemaAdminOrLibraryEditor = checkAccess(SEMA_CORPORATE_TEAM_ID, 'canCreateCollections');
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
      pathname: PATHS.TEAMS.SETTINGS(teamId),
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
      label: 'Team Management',
      path: PATHS.TEAMS.MANAGEMENT(teamId),
      id: TAB.management,
      icon: <TeamIcon width={20} />,
    }),
    (isSemaAdminOrLibraryEditor && {
      label: 'Labels Management',
      path: PATHS.TEAMS.LABELS(teamId),
      id: TAB.labels,
      icon: <TagIcon />,
    }),
  ];

  useEffect(() => {
    if (!isSemaAdminOrLibraryEditor && tab === 'labels') {
      setDefaultTag()
    }
  }, [tab])

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
