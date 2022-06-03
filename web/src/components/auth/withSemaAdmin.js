/* eslint react/no-danger: 0, max-len: 0 */
import React from 'react';
import { useRouter } from 'next/router';
import { PATHS, SEMA_CORPORATE_ORGANIZATION_ID } from '../../utils/constants';
import usePermission from '../../hooks/usePermission';

const withSemaAdmin = (WrappedComponent) => {
  return (props) => {
    if (typeof window !== 'undefined') {
      const Router = useRouter();
      const { checkAccess } = usePermission();

      if (!checkAccess(SEMA_CORPORATE_ORGANIZATION_ID, 'canEditUsers')) {
        Router.push(PATHS.DASHBOARD);
        return null;
      }

      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withSemaAdmin;
