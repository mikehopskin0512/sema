import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { CloseIcon } from '../../Icons';
import styles from './teamCreate.module.scss';
import { PATHS } from '../../../utils/constants';
import { authOperations } from '../../../state/features/auth';

const { updateUser } = authOperations;

const ENABLED_PAGES = [PATHS.DASHBOARD, PATHS.PERSONAL_INSIGHTS, PATHS.INVITATIONS];

const TeamCreateBanner = () => {
  const router = useRouter();
  const { pathname } = router;
  const dispatch = useDispatch();
  const {
    auth,
    organizationsState,
  } = useSelector((state) => ({
    auth: state.authState,
    organizationsState: state.organizationsNewState,
  }));
  const [active, toggleActive] = useState(false);
  const { user, token } = auth;
  const { isOnboarded } = user;
  const { organizations } = organizationsState;

  const redirectUser = () => {
    router.push(PATHS.ORGANIZATION_CREATE);
  };

  const disableTeamCreateBanner = () => {
    const banners = { ...user.banners };
    const updatedUser = { ...user, banners: { ...banners, organizationCreate: false } };
    dispatch(updateUser(updatedUser, token));
  };

  useEffect(() => {
    toggleActive(organizations?.length === 0 && ENABLED_PAGES.includes(pathname) && isOnboarded && user.banners && user?.banners?.teamCreate);
  }, [pathname, organizations, isOnboarded, user]);

  return (
    <>
      <div className={clsx(styles.banner, 'px-160 py-15 is-flex is-align-items-center', !active && 'is-hidden')}>
        <span className="has-text-weight-semibold mr-10">Sema is better with friends!</span>
        <span className="mr-20">Create an organization to share best practices, and view repos together.</span>
        <div className={clsx(styles.hero, '')}>
          <img src="/img/hero-character.svg" alt="hero" />
        </div>
        <button type="button" className="button mr-30" onClick={redirectUser}>Create an Organization</button>
        <CloseIcon className="is-clickable" onClick={disableTeamCreateBanner} />
      </div>
    </>
  );
};

export default TeamCreateBanner;
