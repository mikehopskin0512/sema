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

function TeamCreateBanner() {
  const router = useRouter();
  const { pathname } = router;
  const dispatch = useDispatch();
  const {
    auth,
    teamsState,
  } = useSelector((state) => ({
    auth: state.authState,
    teamsState: state.teamsState,
  }));
  const [active, toggleActive] = useState(false);
  const { user, token } = auth;
  const { isOnboarded } = user;
  const { teams, fetchedTeams } = teamsState;

  const redirectUser = () => {
    router.push(PATHS.TEAM_CREATE);
  };

  const disableTeamCreateBanner = () => {
    const banners = { ...user.banners };
    const updatedUser = { ...user, banners: { ...banners, teamCreate: false } };
    dispatch(updateUser(updatedUser, token));
  };

  useEffect(() => {
    toggleActive(fetchedTeams && teams?.length === 0 && ENABLED_PAGES.includes(pathname) && isOnboarded && user.banners && user?.banners?.teamCreate);
  }, [fetchedTeams, pathname, teams, isOnboarded, user]);

  return active && (
    <div className={clsx(styles.banner, 'px-160 py-15 is-flex is-align-items-center')}>
        <span className="has-text-weight-semibold mr-10">Sema is better with friends!</span>
        <span className="mr-20">Create a team to share best practices, and view repos together.</span>
        <div className={clsx(styles.hero, '')}>
          <img src="/img/hero-character.svg" alt="hero" />
        </div>
        <button type="button" className="button mr-30" onClick={redirectUser}>Create a Team</button>
        <CloseIcon className="is-clickable" onClick={disableTeamCreateBanner} />
      </div>
  );
}

export default TeamCreateBanner;
