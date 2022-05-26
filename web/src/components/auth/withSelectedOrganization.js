/* eslint react/no-danger: 0, max-len: 0 */
import React from 'react';
import { useRouter } from 'next/router';
import { PATHS } from '../../utils/constants';

const withSelectedOrganization = (WrappedComponent) => {
  return (props) => {
    if (typeof window !== 'undefined') {
      const Router = useRouter();
      const accountData = localStorage.getItem('sema_selected_organization');
      const selectedOrganization = accountData ? JSON.parse(accountData) : null;

      if (!selectedOrganization || !selectedOrganization.team) {
        Router.push(PATHS.DASHBOARD);
        return null;
      } else if (Router.pathname.search('organizationId') === -1) {
        Router.push(`${PATHS.ORGANIZATIONS}/${selectedOrganization.organization._id}`);
        return null
      }
      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withSelectedOrganization;
