import React, { useMemo, useRef, useState } from 'react';
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
import {
  PATHS,
  PROFILE_VIEW_MODE,
  SEMA_CORPORATE_ORGANIZATION_ID,
} from '../../../utils/constants';
import NotificationFeed from '../../notificationFeed';
import { authOperations } from '../../../state/features/auth';
import usePermission from '../../../hooks/usePermission';
import { TrophyIcon } from '../../Icons';
import UserMenuItem from '../UserMenuItem';
import Tooltip from '../../Tooltip';
import { useFlags } from '../../launchDarkly';
import { invitationsOperations } from '../../../state/features/invitations';
import * as analytics from '../../../utils/analytics';
import { InviteModal } from '../../../components/header/InviteModal';

const { setSelectedOrganization, setProfileViewMode } = authOperations;
const { createInviteAndHydrateUser, trackSendInvite } = invitationsOperations;

const HeaderMenu = ({ handleLogout, user }) => {
  const [isInviteModal, setInviteModal] = useState(false);
  const userMenu = useRef(null);
  const {
    firstName = '',
    lastName = '',
    roles = [],
    avatarUrl: userAvatar,
    handle,
  } = user;
  const { notificationFeed } = useFlags();
  const fullName = `${firstName} ${lastName}`;
  const {
    auth: { selectedOrganization, token, user: userData },
    organizations,
    portfolios,
  } = useSelector((state) => ({
    auth: state.authState,
    organizations: state.organizationsNewState.organizations,
    portfolios: state.portfoliosState.data.portfolios,
  }));
  const { _id: portfolioId = '' } = portfolios.length ? portfolios[0] : {};
  const { _id: userId } = userData;
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

  const avatarUrl = useMemo(() => user.avatarUrl, [user]);

  const onSwitchPersonalAccount = () => {
    dispatch(setSelectedOrganization({}));
    dispatch(setProfileViewMode(PROFILE_VIEW_MODE.INDIVIDUAL_VIEW));
    toggleUserMenu(false);
    router.push(PATHS.DASHBOARD);
  };

  const portfolioRedirect = () => {
    router.push(`${PATHS.PORTFOLIO.PORTFOLIOS}`);
  };

  const onInvitationsSend = async (email) => {
    const invitation = {
      recipient: email,
      sender: userId,
      isMagicLink: false,
    };
    const { status } = await dispatch(
      createInviteAndHydrateUser(invitation, token)
    );
    analytics.fireAmplitudeEvent(
      analytics.AMPLITUDE_EVENTS.CLICKED_SEND_INVITATION,
      { recipient: email }
    );
    trackSendInvite(
      email,
      invitation.senderName,
      invitation.senderEmail,
      'user'
    );
    return status === 201;
  };

  const isNoOrganizations = !organizations.length;

  return (
    <>
      <Tooltip text="Here is your Developer Portfolio">
        <div
          onClick={() => portfolioRedirect()}
          className={clsx(
            'is-flex is-align-items-center is-justify-content-center border-radius-24px mx-12',
            styles['portfolio-container']
          )}
        >
          <TrophyIcon />
        </div>
      </Tooltip>
      {notificationFeed &&
        process.env.NEXT_PUBLIC_GETSTREAM_APP_ID &&
        process.env.NEXT_PUBLIC_GETSTREAM_APP_KEY && (
          <div
            className={clsx(
              'is-flex is-align-items-center is-justify-content-center border-radius-24px py-20',
              styles['notifications-container']
            )}
          >
            <NotificationFeed />
          </div>
        )}
      <div
        className={clsx('navbar-item has-dropdown', styles.organization)}
        ref={userMenu}
      >
        {/* Menu Items */}
        <div
          className={clsx(
            styles['menu-item-container'],
            'navbar-dropdown is-right p-0 border-radius-8px'
          )}
        >
          <hr className="navbar-divider m-0 has-background-gray-300" />

          {checkAccess(SEMA_CORPORATE_ORGANIZATION_ID, 'canEditUsers') && (
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
            </>
          )}
          <span
            role="button"
            className="navbar-item px-15 py-20"
            onClick={() => {
              toggleUserMenu();
              setInviteModal(true);
            }}
            aria-hidden="true"
          >
            Recommend a Friend
          </span>
          <hr className="navbar-divider m-0 has-background-gray-300" />
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
        <a
          aria-hidden="true"
          className="navbar-link is-arrowless mx-24 px-0"
          onClick={toggleUserMenu}
          ref={userMenu}
        >
          <div className="is-flex is-align-items-center">
            <Avatar
              name={fullName}
              src={avatarUrl || null}
              size="30"
              round
              textSizeRatio={2.5}
            />
            <span
              className={clsx(
                'is-size-7 has-text-weight-semibold mx-3',
                styles['avatar-name-wrapper']
              )}
            >
              {fullName}
            </span>
            <FontAwesomeIcon
              icon={faSortDown}
              size="lg"
              className="mt-neg8 ml-8"
            />
          </div>
        </a>
      </div>
      <InviteModal
        isActive={isInviteModal}
        onClose={setInviteModal}
        onSubmit={onInvitationsSend}
      />
    </>
  );
};

HeaderMenu.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default HeaderMenu;
