import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { CloseIcon } from '../../Icons';
import styles from './teamCreate.module.scss';
import { PATHS } from '../../../utils/constants';

const ENABLED_PAGES = [PATHS.DASHBOARD, PATHS.PERSONAL_INSIGHTS, PATHS.INVITATIONS];

const TeamCreateBanner = () => {
  const router = useRouter();
  const { pathname } = router;
  const {
    auth,
    teamsState,
  } = useSelector((state) => ({
    auth: state.authState,
    teamsState: state.teamsState,
  }));
  const [active, toggleActive] = useState(false);
  const { user } = auth;
  const { isOnboarded } = user;
  const { teams } = teamsState;

  const redirectUser = () => {
    router.push(PATHS.TEAM_CREATE);
  };

  useEffect(() => {
    toggleActive(teams.length === 0 && ENABLED_PAGES.includes(pathname) && isOnboarded);
  }, [pathname, teams, isOnboarded]);

  return (
    <>
      <div className={clsx(styles.banner, 'px-160 py-15 is-flex is-align-items-center', !active && 'is-hidden')}>
        <span className="has-text-weight-semibold mr-10">Sema is better with friends!</span>
        <span className="mr-20">Create a team to share best practices, and view repos together.</span>
        <div className={clsx(styles.hero, '')}>
          <img src="/img/hero-character.svg" alt="hero" />
        </div>
        <button type="button" className="button mr-30" onClick={redirectUser}>Create a Team</button>
        <CloseIcon className="is-clickable" onClick={() => toggleActive(false)} />
      </div>
    </>
  );
};

export default TeamCreateBanner;
