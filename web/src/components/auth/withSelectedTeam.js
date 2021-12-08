/* eslint react/no-danger: 0, max-len: 0 */
import React from 'react';
import { useRouter } from 'next/router';
import { PATHS } from '../../utils/constants';

const withSelectedTeam = (WrappedComponent) => {
  return (props) => {
    if (typeof window !== 'undefined') {
      const Router = useRouter();
      const accountData = localStorage.getItem('sema_selected_team');
      const selectedTeam = accountData ? JSON.parse(accountData) : null;

      if (!selectedTeam || !selectedTeam.team) {
        Router.push(PATHS.DASHBOARD);
        return null;
      }

      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withSelectedTeam;
