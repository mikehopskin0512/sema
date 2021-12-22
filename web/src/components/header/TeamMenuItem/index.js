import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';
import styles from '../header.module.scss';
import { PATHS, PROFILE_VIEW_MODE, SEMA_CORPORATE_TEAM_ID } from '../../../utils/constants';
import { useDispatch } from 'react-redux';
import { authOperations } from '../../../state/features/auth';
import { useRouter } from 'next/router';
import usePermission from '../../../hooks/usePermission';
import { setProfileViewMode } from '../../../state/features/auth/actions';

const { setSelectedTeam } = authOperations;

const TeamMenuItem = ({ role, toggleUserMenu, index }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { checkAccess } = usePermission();

  const goToTeamDetailPage = async () => {
    await router.push(`${PATHS.TEAM._}/${role?.team?._id}`);
  };

  const handleOnTeamClick = () => {
    let viewMode = PROFILE_VIEW_MODE.INDIVIDUAL_VIEW;
    if (role?.team?._id === SEMA_CORPORATE_TEAM_ID) {
      viewMode = PROFILE_VIEW_MODE.SEMA_TEAM_VIEW;
    } else if (!!role?.team?._id) {
      viewMode = PROFILE_VIEW_MODE.TEAM_VIEW;
    }
    
    dispatch(setSelectedTeam(role));
    dispatch(setProfileViewMode(viewMode));
    router.push(`${PATHS.TEAM._}/${role?.team?._id}`);
  };

  const isFirstTeam = (index) => index === 0;

  return (
    <>
      <div className={`${isFirstTeam(index) ? 'has-background-white' : ''} p-15`} onClick={handleOnTeamClick}>
        <div>
          <div className={clsx("is-flex is-flex-wrap-wrap is-align-items-center py-5", styles.team)}>
            <Avatar
              name={role?.team?.name || "Team"}
              src={role?.team?.avatarUrl}
              size="35"
              round
              textSizeRatio={2.5}
              className="mr-10"
              maxInitials={2}
            />
            <div>
              <p className="has-text-black-950 has-text-weight-semibold">{role.team.name}</p>
              <p className="has-text-weight-semibold is-uppercase has-text-gray-500 is-size-9">Team Account</p>
            </div>
          </div>
        </div>
        {
          role.team._id === SEMA_CORPORATE_TEAM_ID && checkAccess(SEMA_CORPORATE_TEAM_ID, 'canEditUsers') && (
            <a
              className="has-text-blue-600 has-text-weight-semibold is-size-7 is-small ml-40 p-5"
              href={`${PATHS.SEMA_ADMIN}/users`}
              style={{ textDecoration: 'none' }}
            >
              Admin Panel
            </a>
          )
        }
        <div className="is-flex is-align-items-center">
          <a
            className="has-text-blue-600 has-text-weight-semibold is-size-7 is-small ml-40 p-5"
            href={`${PATHS.TEAM._}/${role?.team?._id}${PATHS.SETTINGS}`}
            style={{ textDecoration: 'none' }}
            onClick={toggleUserMenu}
          >
            Settings
          </a>
          <a
            className="has-text-blue-600 has-text-weight-semibold is-size-7 is-small mr-20 ml-5 p-5"
            style={{ textDecoration: 'none' }}
            onClick={goToTeamDetailPage}
          >
            Team
          </a>
          {/* TODO: Activate when Label Managements with teams is working. */}
          {/* {checkAccess({name: role?.team?.name}, ViewAdmin) && (
            <a
              className="has-text-blue-600 has-text-weight-semibold is-size-7 is-small ml-40 p-5"
              href="/labels-management"
              style={{ textDecoration: 'none' }}
              onClick={toggleUserMenu}
            >
              Manage Labels
            </a>
          )} */}
        </div>
      </div>
      <hr className="navbar-divider m-0 has-background-gray-300" />
    </>
  )
};

TeamMenuItem.propTypes = {
  toggleUserMenu: PropTypes.func.isRequired,
  role: PropTypes.object.isRequired,
};

export default TeamMenuItem;
