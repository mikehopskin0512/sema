import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { isEmpty } from 'lodash';
import Avatar from 'react-avatar';
import clsx from 'clsx';
import useOutsideClick from '../../../utils/useOutsideClick';
import { setProfileViewMode } from '../../../state/features/auth/actions';
import { authOperations } from '../../../state/features/auth';
import {
  PATHS,
  PROFILE_VIEW_MODE,
  renderMenuItems,
} from '../../../utils/constants';
import { AuthorIcon, ArrowDropdownIcon, ArrowDropupIcon } from '../../Icons';
import { useFlags } from '../../launchDarkly';
import styles from '../header.module.scss';
import constants from './UserHeaderNav.module.scss';
import { InviteModal } from '../InviteModal';
import * as analytics from '../../../utils/analytics';
import { invitationsOperations } from '../../../state/features/invitations';

const { createInviteAndHydrateUser, trackSendInvite } = invitationsOperations;
const { setSelectedOrganization } = authOperations;

function UserHeaderNav({
  toggleHamburger,
  type = 'desktop',
  selectedOrganization,
}) {
  const router = useRouter();
  const { pathname } = router;
  const dispatch = useDispatch();
  const [isInviteModal, setInviteModal] = useState(false);
  const orgMenu = useRef(null);

  const {
    auth: { user: userData, token },
    organizations,
    repositories,
  } = useSelector((state) => ({
    auth: state.authState,
    organizations: state.organizationsNewState,
    repositories: state.repositoriesState,
  }));

  const { _id: userId, isSemaAdmin } = userData;
  const { organizations: orgs } = organizations;
  orgs.sort((a, b) => a.organization.name.localeCompare(b.organization.name));

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

  const { personalDashboard } = useFlags();
  const [orgIndex, setOrgIndex] = useState(null);
  const [openOrgSwitcher, setOpenOrgSwitcher] = useState(false);

  const HEADER_BACKGROUND = constants.headerBackground
    .split(', ')
    .map((item) => item.replace(/[\[\]']+/g, ''));

  const selectedMenuItem = () => ({
    backgroundColor: isEmpty(selectedOrganization)
      ? HEADER_BACKGROUND[HEADER_BACKGROUND.length - 1]
      : HEADER_BACKGROUND[orgIndex % HEADER_BACKGROUND.length],
  });

  const setMenuItemStyle = (matchPath) =>
    pathname === matchPath ? selectedMenuItem() : {};

  const setOrganization = (org) => {
    let viewMode = PROFILE_VIEW_MODE.INDIVIDUAL_VIEW;
    if (org?.organization?._id) {
      viewMode = PROFILE_VIEW_MODE.ORGANIZATION_VIEW;
    }
    dispatch(setSelectedOrganization(org || {}));
    dispatch(setProfileViewMode(viewMode));
  };

  const handleOnOrganizationClick = (org) => {
    setOrganization(org);
    router.push(
      org
        ? `${PATHS.ORGANIZATIONS._}/${org?.organization?._id}${PATHS.REPOS}`
        : PATHS.DASHBOARD
    );
  };

  const toggleOrgSwitcherItemsHoverColor = (e) => {
    const el = e.target;
    el.classList.toggle(
      isEmpty(selectedOrganization)
        ? 'org-colour-personal'
        : `org-colour-${orgIndex % 15}`
    );
  };

  const renderOrgName = () =>
    isEmpty(selectedOrganization)
      ? `${userData.firstName} ${userData.lastName}`
      : selectedOrganization.organization.name;
  const renderAvatar = () =>
    isEmpty(selectedOrganization)
      ? userData.avatarUrl
      : selectedOrganization.organization.avatarUrl;

  useOutsideClick(orgMenu, () => {
    if (openOrgSwitcher) setOpenOrgSwitcher(false);
  });

  useEffect(() => {
    if (
      typeof selectedOrganization === 'object' &&
      organizations.organizations.length > 0
    ) {
      setOrgIndex(
        organizations.organizations.findIndex(
          (element) => element._id === selectedOrganization._id
        )
      );
    }
  }, [selectedOrganization, organizations]);

  const renderDesktopNav = () => (
    <>
      {organizations.organizations.length > 0 && (
        <div
          className={clsx(
            'border-radius-4px is-flex is-justify-content-center is-align-items-center mr-20',
            styles['external-org-switcher-container'],
            isEmpty(selectedOrganization)
              ? 'org-colour-personal'
              : `org-colour-${orgIndex % 15}`
          )}
          onClick={() => setOpenOrgSwitcher((state) => !state)}
          ref={orgMenu}
        >
          <div className="is-flex">
            <Avatar
              name={renderOrgName()}
              src={renderAvatar()}
              size="24"
              textSizeRatio={2.5}
              maxInitials={2}
              round
            />
            <span
              className={clsx(
                'has-text-black-950 has-text-weight-semibold is-size-7 px-8',
                styles['selected-org-name']
              )}
            >
              {renderOrgName()}
            </span>
            {openOrgSwitcher ? (
              <ArrowDropupIcon className={clsx(styles['dropdown-icon'])} />
            ) : (
              <ArrowDropdownIcon className={clsx(styles['dropdown-icon'])} />
            )}
          </div>
          {openOrgSwitcher && (
            <div
              className={clsx(
                styles['internal-org-switcher-container'],
                'has-background-white border-radius-4px'
              )}
            >
              {/* All Orgs will be implemented in a future ticket */}
              {/* <div className={`${styles['org-switcher-item']}`}>
                <div className='is-flex is-align-items-center'>
                  <div className={clsx(styles['sema-org-avatar'], 'border-radius-8px')} />
                  <div className='is-flex is-flex-direction-column'>
                    <p className='has-text-black-950 has-text-weight-semibold'>All Orgs</p>
                    <p className='is-size-8'>X repos</p>
                  </div>
                </div>
              </div> */}
              <div
                className={clsx(
                  styles['org-switcher-item'],
                  'is-flex is-flex-direction-column is-justify-content-center'
                )}
                onClick={() => handleOnOrganizationClick()}
                onMouseEnter={toggleOrgSwitcherItemsHoverColor}
                onMouseLeave={toggleOrgSwitcherItemsHoverColor}
              >
                <div className="is-flex is-align-items-center noHover">
                  <div
                    className={clsx(styles['user-bullet'], 'border-radius-8px')}
                  />
                  <div className={clsx(styles.avatar, 'mx-10')}>
                    <Avatar
                      name={`${userData.firstName} ${userData.lastName}`}
                      src={userData?.avatarUrl}
                      size="42"
                      textSizeRatio={2.5}
                      maxInitials={2}
                      round
                    />
                  </div>
                  <div className="is-flex is-flex-direction-column">
                    <div className="is-flex is-align-items-center">
                      <AuthorIcon size="small" className="mr-4" />
                      <p
                        className={clsx(
                          'has-text-black-950 has-text-weight-semibold',
                          styles['user-account-name']
                        )}
                      >
                        {`${userData.firstName} ${userData.lastName}`}
                      </p>
                    </div>
                    <p className="is-size-8">
                      {repositories.data.repositories.length} repos
                    </p>
                  </div>
                </div>
              </div>
              {organizations.organizations.map((org, idx) => (
                <div
                  key={org._id}
                  className={clsx(
                    'is-flex is-flex-direction-column is-justify-content-center',
                    styles['org-switcher-item']
                  )}
                  onClick={() => handleOnOrganizationClick(org)}
                  onMouseEnter={toggleOrgSwitcherItemsHoverColor}
                  onMouseLeave={toggleOrgSwitcherItemsHoverColor}
                >
                  <div className="is-flex is-align-items-center noHover">
                    <div
                      className={clsx(
                        styles['org-bullet'],
                        'border-radius-8px',
                        `org-colour-${idx % 15}`
                      )}
                    />
                    <div className={clsx(styles.avatar, 'mx-10')}>
                      <Avatar
                        name={org?.organization?.name || 'Organization'}
                        src={org?.organization?.avatarUrl}
                        size="42"
                        textSizeRatio={2.5}
                        maxInitials={3}
                        className="border-radius-8px"
                      />
                    </div>
                    <div className="is-flex is-flex-direction-column">
                      <p className="has-text-black-950 has-text-weight-semibold">
                        {org.organization.name}
                      </p>
                      <p className="is-size-8">
                        {org.organization.repos.length} repos
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {renderMenuItems(personalDashboard, isEmpty, selectedOrganization).map(
        (item, idx) => (
          <Link key={idx} href={item.path}>
            <a
              aria-hidden="true"
              className={item.className}
              style={setMenuItemStyle(
                item.stylePath ? item.stylePath : item.path
              )}
              onMouseEnter={toggleOrgSwitcherItemsHoverColor}
              onMouseLeave={toggleOrgSwitcherItemsHoverColor}
            >
              {item.title}
            </a>
          </Link>
        )
      )}
    </>
  );

  const renderMobileNav = () => (
    <>
      {!isEmpty(selectedOrganization) ? (
        <Link
          href={`${PATHS.ORGANIZATIONS._}/${selectedOrganization.organization._id}${PATHS.DASHBOARD}`}
        >
          <a
            aria-hidden="true"
            className="navbar-item has-text-weight-semibold is-uppercase"
          >
            Dashboard
          </a>
        </Link>
      ) : (
        <Link href={PATHS.DASHBOARD}>
          <a
            aria-hidden="true"
            className="navbar-item has-text-weight-semibold is-uppercase"
            onClick={toggleHamburger}
          >
            Repos
          </a>
        </Link>
      )}
      <Link href={PATHS.PERSONAL_INSIGHTS}>
        <a
          aria-hidden="true"
          className="navbar-item has-text-weight-semibold is-uppercase"
          onClick={toggleHamburger}
        >
          Personal Insights
        </a>
      </Link>

      <a
        aria-hidden="true"
        className="navbar-item has-text-weight-semibold is-uppercase"
        onClick={() => {
          setInviteModal(true);
        }}
      >
        Recommend a Friend
      </a>

      {!isEmpty(selectedOrganization) && (
        <Link
          href={`${PATHS.ORGANIZATIONS._}/${selectedOrganization.organization._id}${PATHS.REPOS}`}
        >
          <a
            aria-hidden="true"
            className="navbar-item has-text-weight-semibold is-uppercase"
          >
            Repos
          </a>
        </Link>
      )}
      <Link href={PATHS.SNIPPETS._}>
        <a
          aria-hidden="true"
          className="navbar-item has-text-weight-semibold is-uppercase"
          onClick={toggleHamburger}
        >
          Snippets
        </a>
      </Link>
      {/* TODO: Activate if we ever need Community Engineering Guides again */}
      {/*
        <Link href="/guides">
          <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
            Community Engineering Guides
          </a>
        </Link>
        */}
      <Link href={PATHS.SUPPORT}>
        <a
          aria-hidden="true"
          className="navbar-item has-text-weight-semibold is-uppercase"
          onClick={toggleHamburger}
        >
          Support
        </a>
      </Link>
      {/* TODO: Activate if we ever need Support Forms */}
      {/*
        <div aria-hidden="true" onClick={openSupportForm} className="is-flex is-align-items-center">
          <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
            Support
          </a>
        </div>
        */}
    </>
  );

  return (
    <>
      {type === 'desktop' ? renderDesktopNav() : renderMobileNav()}
      <InviteModal
        isActive={isInviteModal}
        onClose={setInviteModal}
        onSubmit={onInvitationsSend}
      />
    </>
  );
}

export default UserHeaderNav;
