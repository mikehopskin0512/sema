import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import styles from './organizationCreatePanel.module.scss';
import { PATHS } from '../../../utils/constants';

const OrganizationCreatePanel = () => {
  const router = useRouter();
  const { pathname } = router;
  const dispatch = useDispatch();
  const {
    organizationsState,
  } = useSelector((state) => ({
    organizationsState: state.organizationsState,
  }));
  const [active, toggleActive] = useState(false);
  const { organizations } = organizationsState;

  const redirectUser = () => {
    router.push(PATHS.ORGANIZATION_CREATE);
  };

  useEffect(() => {
    toggleActive(organizations.length === 0);
  }, [organizations]);

  return (
    <>
      <div className={clsx('px-40 py-40 is-flex is-align-items-center is-justify-content-space-between', !active && 'is-hidden', styles.panel)}>
        <div classname="is-flex is-flex-direction-column is-justify-content-center">
          <div className="has-text-weight-semibold has-text-black-950 is-size-4">Sema is better with friends!</div>
          <div className="has-text-black-950">Create a organization to share best practices, and view repos together.</div>
        </div>
        <button type="button" className={clsx('button px-140 py-20 has-text-weight-semibold', styles.createBtn)} onClick={redirectUser}>Create a Organization</button>
      </div>
    </>
  );
};

export default OrganizationCreatePanel;
