import { useSelector } from 'react-redux';
import { SEMA_CORPORATE_ORGANIZATION_ID, PROFILE_VIEW_MODE, SEMA_ROLES } from '../utils/constants';

function usePermission() {
  const { selectedOrganization, profileViewMode } = useSelector((state) => (state.authState));

  const checkAccess = (orgId, permission) => {
    // need to check first if current view mode is Organization view
    if (profileViewMode === PROFILE_VIEW_MODE.INDIVIDUAL_VIEW || !selectedOrganization) return false;
    const role = selectedOrganization?.role?.[permission] && selectedOrganization?.organization?._id == orgId;
    return !!role;
  };

  const checkOrganizationPermission = (permission) => {
    // need to check first if current view mode is Organization view
    if (profileViewMode === PROFILE_VIEW_MODE.INDIVIDUAL_VIEW || !selectedOrganization) return false;
    return !!selectedOrganization?.role[permission];
  };

  const checkOrganization = (organizationId) => {
    // need to check first if current view mode is Organization view
    if (profileViewMode === PROFILE_VIEW_MODE.INDIVIDUAL_VIEW || !selectedOrganization) return false;
    const role = selectedOrganization?.organization?._id == organizationId;
    return !!role;
  };

  const isSemaAdmin = () => {
    // need to check first if current view mode is Sema Corporate Organization
    if (profileViewMode === PROFILE_VIEW_MODE.INDIVIDUAL_VIEW || !selectedOrganization) return false;
    const semaAdminRole = selectedOrganization?.organization?._id == SEMA_CORPORATE_ORGANIZATION_ID && selectedOrganization?.role?.name === SEMA_ROLES.admin;
    return !!semaAdminRole;
  }

  const isOrganizationAdmin = () => {
    // need to check first if current view mode is Sema Corporate Organization
    if (profileViewMode === PROFILE_VIEW_MODE.INDIVIDUAL_VIEW || !selectedOrganization) return false;
    const organizationAdminRole = selectedOrganization?.role?.name === SEMA_ROLES.admin;
    return !!organizationAdminRole;
  }

  const IsOrganizationLibraryEditor = () => {
    // need to check first if current view mode is Sema Corporate Organization
    if (profileViewMode === PROFILE_VIEW_MODE.INDIVIDUAL_VIEW || !selectedOrganization) return false;
    const libraryEditor = selectedOrganization?.role?.name === SEMA_ROLES.libraryEditor;
    return !!libraryEditor;
  }

  const isOrganizationAdminOrLibraryEditor = () => {
    const adminOrEditor = isOrganizationAdmin() || IsOrganizationLibraryEditor();
    return !!adminOrEditor;
  }

  const isIndividualUser = () => {
    return !isSemaAdmin() && !isOrganizationAdminOrLibraryEditor()
  }

  const isOrganizationCollection = (id) => {
    return !!(selectedOrganization.organization.collections.find(collection => collection.collectionData === id || collection.collectionData._id === id));
  }

  return {
    checkAccess,
    checkOrganizationPermission,
    checkOrganization,
    isSemaAdmin,
    isOrganizationAdmin,
    IsOrganizationLibraryEditor,
    isOrganizationAdminOrLibraryEditor,
    isIndividualUser,
    isOrganizationCollection
  };
}

export default usePermission;

