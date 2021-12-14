import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import Link from 'next/link';
import Avatar from 'react-avatar';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../header.module.scss';
import TeamMenuItem from '../TeamMenuItem';
import useOutsideClick from '../../../utils/useOutsideClick';
import { PATHS, SEMA_CORPORATE_TEAM_ID } from '../../../utils/constants';
import { authOperations } from '../../../state/features/auth';
import usePermission from "../../../hooks/usePermission";
import { white50 } from '../../../../styles/_colors.module.scss';

const { setSelectedTeam } = authOperations;

const HeaderMenu = ({
  handleLogout,
  user,
}) => {
  const userMenu = useRef(null);
  const {
    firstName = '',
    lastName = '',
    roles = [],
  } = user;
  const fullName = `${firstName} ${lastName}`;
  const { selectedTeam } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const router = useRouter();
  const { checkTeam } = usePermission();

  useEffect(() => {
    const accountData = localStorage.getItem('sema_selected_team');
    if (accountData && checkTeam(SEMA_CORPORATE_TEAM_ID)) {
      dispatch(setSelectedTeam(JSON.parse(accountData)));
    }
  }, [dispatch]);

  const toggleUserMenu = (status) => {
    if (userMenu.current) {
      if (
        userMenu.current.classList.contains('is-active') ||
        status === false
      ) {
        userMenu.current.classList.remove('is-active');
      } else {
        userMenu.current.classList.add('is-active');
      }
    }
  };

  const onClickOutside = () => {
    toggleUserMenu(false);
  };

  useOutsideClick(userMenu, onClickOutside);

  const avatarUrl = useMemo(() => {
    if (selectedTeam.team) {
      return selectedTeam.team.avatarUrl;
    }
    return user.avatarUrl;
  }, [selectedTeam, user]);
  
  // TODO need to list all teams when the Teams feature is finished
  const semaTeam = useMemo(() => {
    return roles.filter(role => role.team?._id == SEMA_CORPORATE_TEAM_ID);
  }, [roles]);

  const changeAccount = () => {
    dispatch(setSelectedTeam({}));
    toggleUserMenu(false);
    router.push(PATHS.DASHBOARD);
  };

  return (
    <div className={clsx('navbar-item has-dropdown', styles.team)} ref={userMenu}>
      <div className="navbar-dropdown is-right p-0 border-radius-8px" style={{ border: `1px ${white50} solid`, minWidth: 230, background: white50 }}>
        { semaTeam.map((role) => (
          <TeamMenuItem role={role} toggleUserMenu={toggleUserMenu} key={`team-${role}`} />
        )) }
        <div className="has-background-white p-15">
          <div onClick={changeAccount}>
            <div className={clsx('is-flex is-flex-wrap-wrap is-align-items-center py-5', styles.team)}>
              <Avatar
                name={fullName}
                size="35"
                round
                textSizeRatio={2.5}
                className="mr-10"
                maxInitials={2}
              />
              <div>
                <p className="has-text-black-950 has-text-weight-semibold">{fullName}</p>
                <p className="has-text-weight-semibold is-uppercase has-text-gray-500 is-size-9">Personal Account</p>
              </div>
            </div>
          </div>
        </div>
        {/*TODO to enable this after Team feature is merged*/}
        {/*<Link href={PATHS.TEAM}>*/}
        {/*  <a*/}
        {/*    aria-hidden="true"*/}
        {/*    type="button"*/}
        {/*    className="navbar-item has-text-weight-semibold px-15 py-20"*/}
        {/*    onClick={toggleUserMenu}*/}
        {/*  >*/}
        {/*    <span>Create a Team</span>*/}
        {/*    <span className="is-line-height-1 is-size-8 has-text-weight-semibold has-text-primary ml-3">(NEW)</span>*/}
        {/*  </a>*/}
        {/*</Link>*/}
        <hr className={clsx('navbar-divider m-0', styles.divider)} />

        <Link href={PATHS.PROFILE}>
          <span
            role="button"
            className="navbar-item px-15 py-20"
            onClick={toggleUserMenu}
            aria-hidden="true"
          >
            Profile
          </span>
        </Link>
        <hr className={clsx("navbar-divider m-0", styles.divider)} />
        <span
          role="button"
          className="navbar-item has-text-red px-15 py-20"
          style={{ cursor: 'pointer' }}
          onClick={handleLogout}
          tabIndex={0}
          aria-hidden="true"
        >
          Sign out
        </span>
      </div>
      {/* User menu */}
      <a aria-hidden="true" className="navbar-link is-arrowless mx-20" onClick={toggleUserMenu} ref={userMenu}>
        <div className="is-flex is-align-items-center">
          <Avatar
            name={fullName}
            src={avatarUrl || null}
            size="30"
            round
            textSizeRatio={2.5}
          />
          {
            selectedTeam?.team?.name && (
              <div className="ml-10 has-text-black">{selectedTeam.team.name}</div>
            )
          }
          <FontAwesomeIcon icon={faSortDown} size="lg" className="mt-neg8 ml-8" />
        </div>
      </a>
    </div>
  );
}

HeaderMenu.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default HeaderMenu;
