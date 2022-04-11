import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { teamsOperations } from '../../../state/features/teams';
import { PATHS } from '../../../utils/constants';
import useLocalStorage from '../../../hooks/useLocalStorage';

const { inviteTeamUser, fetchTeamsOfUser } = teamsOperations;

const PublicTeamInvite = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => ({
    auth: state.authState,
    rolesState: state.rolesState,
  }));
  const [teamIdInvitation, setTeamIdInvitation] = useLocalStorage('sema-team-invite', '');
  const router = useRouter();
  const { teamId } = router.query;
  const { user, token } = auth;
  
  const joinTeam = async () => {
    await dispatch(inviteTeamUser(teamId, token));
    await dispatch(fetchTeamsOfUser(token));
  };

  useEffect(() => {
    if (user && token) {
      joinTeam();
      router.push(`${PATHS.TEAMS._}/${teamId}${PATHS.SETTINGS}`);
    } else {
      setTeamIdInvitation(teamId);
      router.push('/login');
    }
  }, [teamId, user, token, router]);

  return (
    ''
  );
};

export default PublicTeamInvite;
