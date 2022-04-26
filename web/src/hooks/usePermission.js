import { useSelector } from 'react-redux';
import { SEMA_CORPORATE_TEAM_ID, PROFILE_VIEW_MODE, SEMA_ROLES } from '../utils/constants';

function usePermission() {
  const { selectedTeam, profileViewMode } = useSelector((state) => (state.authState));

  const checkAccess = (teamId, permission) => {
    // need to check first if current view mode is Team view
    if (profileViewMode === PROFILE_VIEW_MODE.INDIVIDUAL_VIEW || !selectedTeam) return false;
    const role = selectedTeam?.role?.[permission] && selectedTeam?.team?._id == teamId;
    return !!role;
  };

  const checkTeamPermission = (permission) => {
    // need to check first if current view mode is Team view
    if (profileViewMode === PROFILE_VIEW_MODE.INDIVIDUAL_VIEW || !selectedTeam) return false;
    return !!selectedTeam?.role[permission];
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
    const semaAdminRole = selectedTeam?.team?._id == SEMA_CORPORATE_TEAM_ID && selectedTeam?.role?.name === SEMA_ROLES.admin;
    return !!semaAdminRole;
  }

  const isTeamAdmin = () => {
    // need to check first if current view mode is Sema Corporate Team
    if (profileViewMode === PROFILE_VIEW_MODE.INDIVIDUAL_VIEW || !selectedTeam) return false;
    const teamAdminRole = selectedTeam?.role?.name === SEMA_ROLES.admin;
    return !!teamAdminRole;
  }

  const IsTeamLibraryEditor = () => {
    // need to check first if current view mode is Sema Corporate Team
    if (profileViewMode === PROFILE_VIEW_MODE.INDIVIDUAL_VIEW || !selectedTeam) return false;
    const libraryEditor = selectedTeam?.role?.name === SEMA_ROLES.libraryEditor;
    return !!libraryEditor;
  }

  const isTeamAdminOrLibraryEditor = () => {
    const adminOrEditor = isTeamAdmin() || IsTeamLibraryEditor();
    return !!adminOrEditor;
  }

  const isIndividualUser = () => {
    return !isSemaAdmin || !isTeamAdmin || !IsTeamLibraryEditor
  }

  const isTeamCollection = (id) => {
    return !!(selectedTeam.team.collections.find(collection => collection.collectionData === id || collection.collectionData._id === id));
  }

  return {
    checkAccess,
    checkTeamPermission,
    checkTeam,
    isSemaAdmin,
    isTeamAdmin,
    IsTeamLibraryEditor,
    isTeamAdminOrLibraryEditor,
    isIndividualUser,
    isTeamCollection
  };
}

export default usePermission;

