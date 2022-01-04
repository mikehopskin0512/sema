import { useSelector } from 'react-redux';
import { SEMA_CORPORATE_TEAM_ID } from '../utils/constants';

function usePermission() {
  const { user } = useSelector((state) => (state.authState));

  const checkAccess = (teamId, permission) => {
    const role = user?.roles?.find((item) => item.role && item.role[permission] && item?.team?._id == teamId);

    return !!role;
  };

  const checkTeam = (teamId) => {
    const role = user?.roles?.find((item) => item?.team?._id == teamId);

    return !!role;
  };
  
  const isSemaAdmin = () => {
    const semaAdminRole = user?.roles?.find((userRole) => userRole?.team?._id == SEMA_CORPORATE_TEAM_ID && userRole?.role?.name === 'Admin');
    return !!semaAdminRole;
  }

  return {
    checkAccess,
    checkTeam,
    isSemaAdmin,
  };
}

export default usePermission;

