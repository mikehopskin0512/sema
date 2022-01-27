/* eslint react/no-danger: 0, max-len: 0 */
import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { isSemaDefaultCollection, isTeamDefaultCollection } from '../../utils';
import usePermission from '../../hooks/usePermission';

const withSnippetsPermission = (WrappedComponent, permission) => {
  return (props) => {
    if (typeof window !== 'undefined') {
      const router = useRouter();
      const { checkTeamPermission } = usePermission();
      const { cid } = router.query;
  
      const { authState, collectionState } = useSelector((state) => ({
        authState: state.authState,
        collectionState: state.commentsState,
      }));
  
      const { selectedTeam } = authState;
      const { collection } = collectionState;
      
      if (!checkTeamPermission(permission)) {
        if (cid && collection) {
          if (!isSemaDefaultCollection(collection?.name) && !isTeamDefaultCollection(selectedTeam, collection)) {
            router.back();
            return null;
          }
        } else {
          router.back();
          return null;
        }
      }

      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withSnippetsPermission;
