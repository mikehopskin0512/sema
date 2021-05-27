/* eslint react/no-danger: 0, max-len: 0 */
import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const withSemaAdmin = (WrappedComponent) => {
  return (props) => {
    if (typeof window !== 'undefined') {
      const Router = useRouter();
      const { user } = useSelector((state) => state.authState);
      const isSemaAdmin = () => user && user.isSemaAdmin;

      if (!isSemaAdmin()) {
        Router.push('/admin');
        return null;
      }

      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withSemaAdmin;
