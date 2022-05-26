import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';
import styles from '../header.module.scss';
import { PATHS, PROFILE_VIEW_MODE, TAB } from '../../../utils/constants';
import { useDispatch } from 'react-redux';
import { authOperations } from '../../../state/features/auth';
import { useRouter } from 'next/router';
import { setProfileViewMode } from '../../../state/features/auth/actions';
import { SettingsIcon } from "../../Icons";

const { setSelectedOrganization } = authOperations;

const OrganizationMenuItem = ({ role, toggleUserMenu, index, isSelected }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const setOrganization = () => {
    let viewMode = PROFILE_VIEW_MODE.INDIVIDUAL_VIEW;
    if (!!role?.organization?._id) {
      viewMode = PROFILE_VIEW_MODE.ORGANIZATION_VIEW;
    }
    dispatch(setSelectedOrganization(role));
    dispatch(setProfileViewMode(viewMode));
  }

  const handleOnOrganizationClick = () => {
    setOrganization();
    router.push(`${PATHS.ORGANIZATIONS._}/${role?.organization?._id}${PATHS.DASHBOARD}`);
    toggleUserMenu();
  };

  const handleSettingsClick = () => {
    setOrganization();
    router.push(`${PATHS.ORGANIZATIONS._}/${role?.organization?._id}${PATHS.SETTINGS}?tab=${TAB.management}`);
  }

  const isFirstOrganization = (index) => index === 0;

  return (
    <>
      <div className={`${isSelected ? 'has-background-white' : ''} p-15 is-relative`}>
        <div>
          <div className={clsx(`is-flex ${isSelected && 'is-flex-direction-column'} is-align-items-center py-5`, styles.organization)} onClick={handleOnOrganizationClick}>
            <Avatar
              name={role?.organization?.name || "Organization"}
              src={role?.organization?.avatarUrl}
              size="35"
              round
              textSizeRatio={2.5}
              className={`${isSelected ? 'mb-5' : 'mr-10'}`}
              maxInitials={2}
            />
            {isSelected ? (
              <>
                <p className={`has-text-black-950 has-text-weight-semibold mb-5`}>{role.organization?.name}</p>
                <p className="has-text-weight-semibold is-uppercase has-text-gray-500 is-size-9">Organization Account</p>
              </>
            ) : (
              <div>
                <p className={`has-text-black-950 has-text-weight-semibold`}>{role.organization?.name}</p>
                <p className="has-text-weight-semibold is-uppercase has-text-gray-500 is-size-9">Organization Account</p>
              </div>
            )}
          </div>
          <a
            className="is-absolute has-text-primary is-top-right p-10"
            style={{ textDecoration: 'none' }}
          >
            <SettingsIcon size="small" onClick={handleSettingsClick} />
          </a>
          {/* TODO: Activate when Label Managements with organizations is working. */}
          {/* {checkAccess({name: role?.organization?.name}, ViewAdmin) && (
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

OrganizationMenuItem.propTypes = {
  toggleUserMenu: PropTypes.func.isRequired,
  role: PropTypes.object.isRequired,
};

export default OrganizationMenuItem;
