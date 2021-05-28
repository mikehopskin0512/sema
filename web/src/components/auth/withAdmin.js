/* eslint react/no-danger: 0, max-len: 0 */
import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const withAdmin = (WrappedComponent) => {
  return (props) => {
    if (typeof window !== 'undefined') {
      const Router = useRouter();
      const { user } = useSelector((state) => state.authState);
      const isAdmin = () => !!(user && user.organizations && user.organizations.findIndex(org => org.isAdmin) > -1);

      if (!isAdmin()) {
        Router.push('/dashboard');
        return null;
      }

      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withAdmin;
