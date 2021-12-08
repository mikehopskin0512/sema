import React  from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';
import styles from '../header.module.scss';
import { PATHS, SEMA_CORPORATE_TEAM_ID } from '../../../utils/constants';
import { useDispatch } from 'react-redux';
import { authOperations } from '../../../state/features/auth';
import { useRouter } from 'next/router';
import usePermission from '../../../hooks/usePermission';

const { setSelectedTeam } = authOperations;

const TeamMenuItem = ({ role, toggleUserMenu }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { checkTeam, checkAccess } = usePermission();
  
  const isSemaCorporateTeam = checkTeam(SEMA_CORPORATE_TEAM_ID);

  const goToTeamDetailPage = async () => {
    if (!isSemaCorporateTeam) return;
    await router.push(`${PATHS.TEAMS}/${role?.team?._id}`);
  };
  
  const handleClick = () => {
    if (!isSemaCorporateTeam) return;
    dispatch(setSelectedTeam(role));
  };

  return (
    <>
      <div className="has-background-white p-15" onClick={handleClick}>
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
          checkAccess(SEMA_CORPORATE_TEAM_ID, 'canEditUsers') && (
            <a
              className="has-text-blue-600 has-text-weight-semibold is-size-7 is-small ml-40 p-5"
              href={`${PATHS.SEMA_ADMIN}/users`}
              style={{ textDecoration: 'none' }}
            >
              Admin Panel
            </a>
          )
        }
        <div className="is-flex">
          {/* TODO Hide this until Team management feature is merged */}
          {/*<a*/}
          {/*  className="has-text-blue-600 has-text-weight-semibold is-size-7 is-small ml-40 p-5"*/}
          {/*  href="#"*/}
          {/*  style={{ textDecoration: 'none' }}*/}
          {/*>*/}
          {/*  Settings*/}
          {/*</a>*/}
          <a
            className="has-text-blue-600 has-text-weight-semibold is-size-7 is-small ml-40 p-5"
            style={{ textDecoration: 'none' }}
            onClick={goToTeamDetailPage}
          >
            Team
          </a>
        </div>
      </div>
      <hr className={clsx('navbar-divider m-0', styles.divider)} />
    </>
  )
};

TeamMenuItem.propTypes = {
  toggleUserMenu: PropTypes.func.isRequired,
  role: PropTypes.object.isRequired,
};

export default TeamMenuItem;
