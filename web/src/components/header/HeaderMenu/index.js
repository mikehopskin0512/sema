import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import Link from 'next/link';
import Avatar from 'react-avatar';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../header.module.scss';
import OrganizationMenuItem from '../OrganizationMenuItem';
import useOutsideClick from '../../../utils/useOutsideClick';
import { PATHS, PROFILE_VIEW_MODE, SEMA_CORPORATE_ORGANIZATION_ID } from '../../../utils/constants';
import { authOperations } from '../../../state/features/auth';
import usePermission from "../../../hooks/usePermission";
import { TrophyIcon } from '../../Icons';
import UserMenuItem from '../UserMenuItem';
import Tooltip from '../../Tooltip';
const { setSelectedOrganization, setProfileViewMode } = authOperations;

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
  const { auth: { selectedOrganization, token }, organizations, portfolios } = useSelector(
    (state) => ({
      auth: state.authState,
      organizations: state.organizationsNewState.organizations,
      portfolios: state.portfoliosState.data.portfolios
    }),
  );
  const { _id: portfolioId = '' } = portfolios.length ? portfolios[0] : {};
  const dispatch = useDispatch();
  const router = useRouter();
  const { checkAccess } = usePermission();
  const orderedOrganizations = Object.values(organizations);

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
    if (selectedOrganization?.organization) {
      return selectedOrganization?.organization?.avatarUrl;
    }
    return user.avatarUrl;
  }, [selectedOrganization, user]);

  const onSwitchPersonalAccount = () => {
    dispatch(setSelectedOrganization({}));
    dispatch(setProfileViewMode(PROFILE_VIEW_MODE.INDIVIDUAL_VIEW));
    toggleUserMenu(false);
    router.push(PATHS.DASHBOARD);
  };

  const getAvatarName = useMemo(() => {
    let name = fullName
    if (selectedOrganization?.organization?.name) {
      name = selectedOrganization?.organization.name;
    }
    return name;
  }, [selectedOrganization, user])

  const renderMenuItems = useMemo(() => {
    // Sort organizations, first one should be the selected organization.
    const selectedOrganizationIndex = orderedOrganizations.splice(orderedOrganizations.findIndex(organization => organization.organization?._id === selectedOrganization?.organization?._id), 1)[0];
    selectedOrganizationIndex && orderedOrganizations.unshift(selectedOrganizationIndex);

    const menuItems = orderedOrganizations.map((organization, index) => (
      <OrganizationMenuItem role={organization} toggleUserMenu={toggleUserMenu} key={`organization-${organization._id}`} index={index} isSelected={organization.organization?._id === selectedOrganization?.organization?._id}/>
    ))

    const userMenu =
      <>
        <UserMenuItem user={user} onSwitchPersonalAccount={onSwitchPersonalAccount} isSelected={Object.keys(selectedOrganization).length === 0} />
        <hr className="navbar-divider m-0 has-background-gray-300" />
      </>

    Object.keys(selectedOrganization).length ? menuItems.push(userMenu) : menuItems.unshift(userMenu);
    return menuItems;
  }, [orderedOrganizations]);

  const portfolioRedirect = () => {
    router.push(`${PATHS.PORTFOLIO.PORTFOLIOS}`);
  };

  const isNoOrganizations = !organizations.length;

  return (
    <>
      <Tooltip text={'Here is your Developer Portfolio'}>
        <div onClick={() => portfolioRedirect()} className={clsx('is-flex is-align-items-center is-justify-content-center border-radius-24px', styles['portfolio-container'])}>
          <TrophyIcon />
        </div>
      </Tooltip>
      <div className={clsx('navbar-item has-dropdown', styles.organization)} ref={userMenu}>
        {/* Menu Items */}
        <div className={clsx(styles['menu-item-container'], "navbar-dropdown is-right p-0 border-radius-8px")}>
          {renderMenuItems}
          <Link href={PATHS.ORGANIZATION_CREATE}>
          <a
            aria-hidden="true"
            type="button"
            className="navbar-item px-15 py-20 is-flex"
            onClick={toggleUserMenu}
          >
            <div>
              <span>{isNoOrganizations ? 'Create an Organization' : 'Add an Organization'}</span>
              <span className="is-size-8 has-text-weight-semibold has-text-primary ml-3">(NEW)</span>
            </div>
          </a>
          </Link>
          <hr className="navbar-divider m-0 has-background-gray-300" />

          {
            checkAccess(SEMA_CORPORATE_ORGANIZATION_ID, 'canEditUsers') && (
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
