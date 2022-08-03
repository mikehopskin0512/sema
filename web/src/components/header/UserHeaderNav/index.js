import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { isEmpty } from 'lodash';
import { setProfileViewMode } from '../../../state/features/auth/actions';
import { authOperations } from '../../../state/features/auth';
import { PATHS, PROFILE_VIEW_MODE, renderMenuItems } from '../../../utils/constants';
import { useFlags } from '../../launchDarkly';
import { InviteModal } from "../InviteModal";
import OrgSwitcher from '../OrganizationSwitcher';
import * as analytics from '../../../utils/analytics';
import { invitationsOperations } from '../../../state/features/invitations';
import { blue50, white0 } from '../../../../styles/_colors.module.scss';
import { COLORS_ARRAY } from './constants';

const { createInviteAndHydrateUser, trackSendInvite } = invitationsOperations;
const { setSelectedOrganization } = authOperations;

function UserHeaderNav({
  toggleHamburger,
  type = 'desktop'
}) {
  const router = useRouter();
  const { pathname } = router;
  const dispatch = useDispatch();
  const [isInviteModal, setInviteModal] = useState(false);

  const {
    auth: { user: userData, token, isAllOrgsSelected, selectedOrganization },
    organizations,
    repositories,
  } = useSelector((state) => ({
    auth: state.authState,
    organizations: state.organizationsNewState,
    repositories: state.repositoriesState,
  }));

  const { _id: userId  } = userData;
  const {organizations: orgs} = organizations;
  orgs.sort((a, b) => a.organization.name.localeCompare(b.organization.name))

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

  const setSelectedOrgColourOrClass = (toggleClass = false) => {
    switch (true) {
      case orgIndex === null:
        return white0;
      case isAllOrgsSelected:
        return toggleClass ? 'org-colour-allorgs' : blue50;
      case !isAllOrgsSelected && isEmpty(selectedOrganization):
        return toggleClass ? 'org-colour-personal' : COLORS_ARRAY[COLORS_ARRAY.length - 1];
      case !isAllOrgsSelected && !isEmpty(selectedOrganization):
        return toggleClass ? `org-colour-${orgIndex % 15}` : COLORS_ARRAY[orgIndex % COLORS_ARRAY.length];
      default:
        break;
    }
  }

  const selectedMenuItem = () => ({
    backgroundColor: setSelectedOrgColourOrClass()
  });

  const setMenuItemStyle = (matchPath) => pathname === matchPath ? selectedMenuItem() : {};

  const setOrganization = (org, allOrgs) => {
    let viewMode = PROFILE_VIEW_MODE.INDIVIDUAL_VIEW;
    if (org?.organization?._id) {
      viewMode = PROFILE_VIEW_MODE.ORGANIZATION_VIEW;
    }
    dispatch(setSelectedOrganization((org || {}), allOrgs));
    dispatch(setProfileViewMode(viewMode));
  };

  const handleOnOrganizationClick = (org, allOrgs = false) => {
    setOrganization(org, allOrgs);
    router.push(
      org
        ? `${PATHS.ORGANIZATIONS._}/${org?.organization?._id}${PATHS.REPOS}`
        : PATHS.DASHBOARD
    );
  };

  const toggleOrgSwitcherItemsHoverColor = (e) => {
    const el = e.target;
    el.classList.toggle(setSelectedOrgColourOrClass(true));
  };

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
      {organizations.organizations.length > 0 && 
        <OrgSwitcher 
          organizations={organizations}
          selectedOrganization={selectedOrganization}
          isAllOrgsSelected={isAllOrgsSelected}
          userData={userData}
          repositories={repositories}
          openOrgSwitcher={openOrgSwitcher}
          setOpenOrgSwitcher={setOpenOrgSwitcher}
          orgIndex={orgIndex}
          handleOnOrganizationClick={handleOnOrganizationClick}
          toggleOrgSwitcherItemsHoverColor={toggleOrgSwitcherItemsHoverColor}
        />
      }
      {
        renderMenuItems(personalDashboard, isEmpty, selectedOrganization).map((item, idx) => <Link key={idx} href={item.path}>
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
      }
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
