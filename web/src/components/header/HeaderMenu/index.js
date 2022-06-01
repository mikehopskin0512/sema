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
import NotificationFeed from '../../notificationFeed';
import { authOperations } from '../../../state/features/auth';
import usePermission from "../../../hooks/usePermission";
import { TrophyIcon } from '../../Icons';
import UserMenuItem from '../UserMenuItem';
import Tooltip from '../../Tooltip';
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
    avatarUrl: userAvatar,
    handle
  } = user;
  const fullName = `${firstName} ${lastName}`;
  const { auth: { selectedTeam, token }, teams, portfolios } = useSelector(
    (state) => ({
      auth: state.authState,
      teams: state.teamsState.teams,
      portfolios: state.portfoliosState.data.portfolios
    }),
  );
  const { _id: portfolioId = '' } = portfolios.length ? portfolios[0] : {};
  const dispatch = useDispatch();
  const router = useRouter();
  const { checkAccess } = usePermission();
  const orderedTeams = Object.values(teams);

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

  const renderMenuItems = useMemo(() => {
    // Sort teams, first one should be the selected team.
    const selectedTeamIndex = orderedTeams.splice(orderedTeams.findIndex(team => team.team?._id === selectedTeam?.team?._id), 1)[0];
    selectedTeamIndex && orderedTeams.unshift(selectedTeamIndex);

    const menuItems = orderedTeams.map((team, index) => (
      <TeamMenuItem role={team} toggleUserMenu={toggleUserMenu} key={`team-${team._id}`} index={index} isSelected={team.team?._id === selectedTeam?.team?._id}/>
    ))

    const userMenu =
      <>
        <UserMenuItem user={user} onSwitchPersonalAccount={onSwitchPersonalAccount} isSelected={Object.keys(selectedTeam).length === 0} />
        <hr className="navbar-divider m-0 has-background-gray-300" />
      </>

    Object.keys(selectedTeam).length ? menuItems.push(userMenu) : menuItems.unshift(userMenu);
    return menuItems;
  }, [orderedTeams]);

  const portfolioRedirect = () => {
    router.push(`${PATHS.PORTFOLIO.PORTFOLIOS}`);
  };

  const isNoTeams = !teams.length;

  return (
    <>
      <Tooltip text={'Here is your Developer Portfolio'}>
        <div onClick={() => portfolioRedirect()} className={clsx('is-flex is-align-items-center is-justify-content-center border-radius-24px mx-12', styles['portfolio-container'])}>
          <TrophyIcon />
        </div>
      </Tooltip>
      <div className={clsx('is-flex is-align-items-center is-justify-content-center border-radius-24px py-20', styles['notifications-container'])}>
          <NotificationFeed />
      </div>
      <div className={clsx('navbar-item has-dropdown', styles.team)} ref={userMenu}>
        {/* Menu Items */}
        <div className={clsx(styles['menu-item-container'], "navbar-dropdown is-right p-0 border-radius-8px")}>
          {renderMenuItems}
          <Link href={PATHS.TEAM_CREATE}>
          <a
            aria-hidden="true"
            type="button"
            className="navbar-item px-15 py-20 is-flex"
            onClick={toggleUserMenu}
          >
            <div>
              <span>{isNoTeams ? 'Create a Team' : 'Add a Team'}</span>
              <span className="is-size-8 has-text-weight-semibold has-text-primary ml-3">(NEW)</span>
            </div>
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
        <a aria-hidden="true" className="navbar-link is-arrowless mx-24 px-0" onClick={toggleUserMenu} ref={userMenu}>
          <div className="is-flex is-align-items-center">
            <Avatar
              name={getAvatarName}
              src={avatarUrl || null}
              size="30"
              round
              textSizeRatio={2.5}
            />
            <span className={clsx("is-size-7 has-text-weight-semibold mx-3", styles['avatar-name-wrapper'])}>{getAvatarName}</span>
            <FontAwesomeIcon icon={faSortDown} size="lg" className="mt-neg8 ml-8" />
          </div>
        </a>
      </div>
    </>
  );
}

HeaderMenu.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default HeaderMenu;
