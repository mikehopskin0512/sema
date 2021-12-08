/* eslint react/no-danger: 0, max-len: 0 */
import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { SEMA_CORPORATE_TEAM_ID } from '../../utils/constants';
import { isSemaDefaultCollection } from '../../utils';
import usePermission from '../../hooks/usePermission';

const withSnippetsPermission = (WrappedComponent, permission) => {
  return (props) => {
    if (typeof window !== 'undefined') {
      const router = useRouter();
      const { checkAccess } = usePermission();
      const { cid } = router.query;
  
      const { collectionState } = useSelector((state) => ({
        auth: state.authState,
        collectionState: state.commentsState,
      }));
  
      const { collection } = collectionState;
      
      if (!checkAccess(SEMA_CORPORATE_TEAM_ID, permission)) {
        if (cid && collection) {
          if (!isSemaDefaultCollection(collection?.name)) {
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
