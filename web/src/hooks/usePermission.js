import { useSelector } from 'react-redux';
import { DEFAULT_COLLECTION_NAME } from '../utils/constants';

function usePermission() {
  const { user } = useSelector((state) => (state.authState));
  const { collectionState: { collection } } = useSelector((state) => ({
    collectionState: state.commentsState,
  }));

  const checkAccess = (team, permission) => {
    // TODO this will be replaced with more team comparison here in the future
    if (collection?.name?.toLowerCase() === DEFAULT_COLLECTION_NAME) {
      return true;
    }

    const role = user?.roles?.find((item) => item.role[permission] && item.team.name === team.name);

    return !!role;
  };

  return {
    checkAccess,
  };
}

export default usePermission;

