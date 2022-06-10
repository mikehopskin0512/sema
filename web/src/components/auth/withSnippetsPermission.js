/* eslint react/no-danger: 0, max-len: 0 */
import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { isSemaDefaultCollection, isOrganizationDefaultCollection } from '../../utils';
import usePermission from '../../hooks/usePermission';

const withSnippetsPermission = (WrappedComponent, permission) => {
  return (props) => {
    if (typeof window !== 'undefined') {
      const router = useRouter();
      const { checkOrganizationPermission } = usePermission();
      const { cid } = router.query;

      const { authState, collectionState } = useSelector((state) => ({
        authState: state.authState,
        collectionState: state.commentsState,
      }));

      const { selectedOrganization } = authState;
      const { collection } = collectionState;

      if (!checkOrganizationPermission(permission)) {
        if (cid && collection) {
          if (!isSemaDefaultCollection(collection?.name) && !isOrganizationDefaultCollection(selectedOrganization, collection)) {
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
