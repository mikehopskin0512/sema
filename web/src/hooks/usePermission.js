import { useSelector } from 'react-redux';
import { SEMA_CORPORATE_TEAM_ID, PROFILE_VIEW_MODE } from '../utils/constants';

function usePermission() {
  const { selectedTeam, profileViewMode } = useSelector((state) => (state.authState));

  const checkAccess = (teamId, permission) => {
    // need to check first if current view mode is Team view
    if (profileViewMode === PROFILE_VIEW_MODE.INDIVIDUAL_VIEW || !selectedTeam) return false;
    const role = selectedTeam?.role[permission] && selectedTeam?.team?._id == teamId;

    return !!role;
  };

  const checkTeam = (teamId) => {
    // need to check first if current view mode is Team view
    if (profileViewMode === PROFILE_VIEW_MODE.INDIVIDUAL_VIEW || !selectedTeam) return false;
    const role = selectedTeam?.team?._id == teamId;

    return !!role;
  };
  
  const isSemaAdmin = () => {
    // need to check first if current view mode is Sema Corporate Team
    if (profileViewMode === PROFILE_VIEW_MODE.INDIVIDUAL_VIEW || !selectedTeam) return false;
    const semaAdminRole = selectedTeam?.team?._id == SEMA_CORPORATE_TEAM_ID && selectedTeam?.role?.name === 'Admin';
    return !!semaAdminRole;
  }

  return {
    checkAccess,
    checkTeam,
    isSemaAdmin,
  };
}

export default usePermission;

