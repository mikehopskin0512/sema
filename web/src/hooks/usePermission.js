import { useSelector } from 'react-redux';

function usePermission() {
  const { user } = useSelector((state) => (state.authState));

  const checkAccess = (team, permission) => {
    // TODO this will be replaced with more team comparison here in the future
    const role = user.roles.find((item) => item.role[permission] && item.team.name === team.name);

    return !!role;
  };

  return {
    checkAccess,
  };
}

export default usePermission;
