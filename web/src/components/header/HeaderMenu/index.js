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
import { PATHS, PROFILE_VIEW_MODE, SEMA_CORPORATE_TEAM_ID } from '../../../utils/constants';
import { authOperations } from '../../../state/features/auth';
import usePermission from "../../../hooks/usePermission";

const { setSelectedTeam, setProfileViewMode } = authOperations;

const HeaderMenu = ({
  handleLogout,
  user,
}) => {
  const userMenu = useRef(null);
  const {
    firstName = '',
    lastName = '',
    roles = [],
    avatarUrl: userAvatar
  } = user;
  const fullName = `${firstName} ${lastName}`;
  const { auth: { selectedTeam }, teams } = useSelector(
    (state) => ({
      auth: state.authState,
      teams: state.teamsState
    }),
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const { checkAccess } = usePermission();

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
    if (selectedTeam?.team) {
      return selectedTeam?.team?.avatarUrl;
    }
    return user.avatarUrl;
  }, [selectedTeam, user]);

  const renderTeamMenu = useMemo(() => {
    return teams.teams.map((team, index) => (
      <TeamMenuItem role={team} toggleUserMenu={toggleUserMenu} key={`team-${team._id}`} index={index}/>
    ))
  }, [teams]);

  const onSwitchPersonalAccount = () => {
    dispatch(setSelectedTeam({}));
    dispatch(setProfileViewMode(PROFILE_VIEW_MODE.INDIVIDUAL_VIEW));
    toggleUserMenu(false);
    router.push(PATHS.DASHBOARD);
  };

  const getAvatarName = useMemo(() => {
    let name = fullName
    if (selectedTeam?.team?.name) {
      name = selectedTeam?.team.name;
    }
    return name;
  }, [selectedTeam, user])

  return (
    <div className={clsx('navbar-item has-dropdown', styles.team)} ref={userMenu}>
      {/* Menu Items */}
      <div className={clsx(styles['menu-item-container'], "navbar-dropdown is-right p-0 border-radius-8px")}>
        {renderTeamMenu}
        <div className={`p-15 ${teams.teams[0] ? '' : 'has-background-white'}`}>
          <div onClick={onSwitchPersonalAccount}>
            <div className={clsx('is-flex is-flex-wrap-wrap is-align-items-center py-5', styles.team)}>
              <Avatar
                name={fullName}
                src={userAvatar || null}
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
        <hr className="navbar-divider m-0 has-background-gray-300" />
        <Link href={PATHS.TEAM_CREATE}>
         <a
           aria-hidden="true"
           type="button"
           className="navbar-item px-15 py-20"
           onClick={toggleUserMenu}
         >
           <span>Create a Team</span>
           <span className="is-line-height-1 is-size-8 has-text-weight-semibold has-text-primary ml-3">(NEW)</span>
         </a>
        </Link>
        <hr className="navbar-divider m-0 has-background-gray-300" />

        {
          checkAccess(SEMA_CORPORATE_TEAM_ID, 'canEditUsers') && (
            <>
        <Link href={`${PATHS.SEMA_ADMIN}/users`}>
          <span
            role="button"
            className="navbar-item px-15 py-20"
            onClick={toggleUserMenu}
            aria-hidden="true"
          >
            Admin Panel
          </span>
        </Link>
        <hr className="navbar-divider m-0 has-background-gray-300" />
        </>)}
        <Link href={PATHS.PROFILE}>
          <span
            role="button"
            className="navbar-item px-15 py-20"
            onClick={toggleUserMenu}
            aria-hidden="true"
          >
            Account
          </span>
        </Link>
        <hr className="navbar-divider m-0 has-background-gray-300" />
        <span
          role="button"
          className="navbar-item has-text-red-500 px-15 py-20"
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
            name={getAvatarName}
            src={avatarUrl || null}
            size="30"
            round
            textSizeRatio={2.5}
          />
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
