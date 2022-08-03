/* eslint-disable jsx-a11y/anchor-is-valid */
import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import Link from 'next/link';
import Avatar from 'react-avatar';
import styles from './header.module.scss';
import HeaderMenu from './HeaderMenu';
import OrganizationMenuItem from './OrganizationMenuItem';
import useOutsideClick from '../../utils/useOutsideClick';
import SupportForm from '../supportForm';
import SignOutModal from '../signOutModal';
import usePermission from '../../hooks/usePermission';
import { organizationsOperations } from '../../state/features/organizations[new]';
import { portfoliosOperations } from '../../state/features/portfolios';
import Logo from '../Logo';
import { PATHS } from '../../utils/constants';
import useAuthEffect from '../../hooks/useAuthEffect';
import UserHeaderNav from './UserHeaderNav';
import { isEmpty } from 'lodash';

const { fetchOrganizationsOfUser } = organizationsOperations;
const { fetchPortfoliosOfUser } = portfoliosOperations;

function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [supportForm, setSupportForm] = useState(false);
  const [signOutModal, setSignOutModal] = useState(false);
  const { isSemaAdmin } = usePermission();

  // Create REFs for menus
  const burger = useRef(null);
  const menu = useRef(null);
  const userMenu = useRef(null);

  // Get auth state
  const auth = useSelector((state) => state.authState);

  const { user, token, selectedOrganization } = auth;
  const {
    isVerified = false,
    organizations = [],
    isWaitlist = Boolean(parseInt(process.env.NEXT_PUBLIC_WAITLIST_ENABLED)),
    roles = [],
    avatarUrl,
    firstName = '',
    lastName = '',
  } = user ?? {};
  // Initials replaced by react-avatar
  // const userInitials = (user) ? `${firstName.charAt(0)}${lastName.charAt(0)}` : '';

  // Use 1st org (for now) and get isAdmin
  // const [currentOrg = { isAdmin: false }] = organizations;

  const closeSupportForm = () => setSupportForm(false);

  const handleClick = () => {
    if (selectedOrganization && !isEmpty(selectedOrganization)) {
      return router.push(`${PATHS.ORGANIZATIONS._}/${selectedOrganization?.organization?._id}${PATHS.DASHBOARD}`);
    }
    return router.push(`${PATHS.DASHBOARD}`);
  }

  useAuthEffect(() => {
    dispatch(fetchOrganizationsOfUser(token));
    dispatch(fetchPortfoliosOfUser(user._id, token));
  }, [dispatch]);

  const toggleHamburger = () => {
    if (menu.current && burger.current) {
      if (menu.current.classList.contains('is-active')) {
        menu.current.classList.remove('is-active');
      } else {
        menu.current.classList.add('is-active');
      }

      if (burger.current.classList.contains('is-active')) {
        burger.current.classList.remove('is-active');
      } else {
        burger.current.classList.add('is-active');
      }
    }
  };

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

  const handleLogout = () => {
    setSignOutModal(true);
  };

  const onClickOutside = () => {
    toggleUserMenu(false);
  };

  // Check for clicks outside of userMenu
  useOutsideClick(userMenu, onClickOutside);

  const onCloseSignOutModal = () => setSignOutModal(false);

  return (
    <header className='has-background-white'>
      <SupportForm active={supportForm} closeForm={closeSupportForm} />
      <SignOutModal active={signOutModal} onClose={onCloseSignOutModal} />
      <nav
        className="navbar container py-16"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <a className="is-flex is-align-items-center" onClick={handleClick}>
            <Logo shape="symbol" width={32} height={32} />
          </a>
          <div className={clsx(styles.separator, 'has-background-gray-400 mx-16')} />
          {token && isVerified && !isWaitlist && (
            <button
              onClick={toggleHamburger}
              type="button"
              className="navbar-burger burger button is-white"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
              ref={burger}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          )}
        </div>
        {
          token && isVerified && !isWaitlist ? (
            <div className="navbar-menu" ref={menu}>
              {/* Desktop menu */}
              <div
                className="navbar-start is-hidden-mobile is-hidden-tablet-only is-flex-grow-1 is-align-items-center"
              >
                <UserHeaderNav
                  toggleHamburger={toggleHamburger}
                  isSemaAdmin={isSemaAdmin}
                  type='desktop'
                />
              </div>
              {/* Hamburger menu (mobile & tablet) */}
              <div className="navbar-start is-hidden-desktop">
                <UserHeaderNav
                  toggleHamburger={toggleHamburger}
                  isSemaAdmin={isSemaAdmin}
                  type='mobile'
                  selectedOrganization
                />
                <hr className="navbar-divider" />
                <Link href={PATHS.ORGANIZATIONS._}>
                  <a
                    aria-hidden="true"
                    type="button"
                    className="navbar-item has-text-weight-semibold is-uppercase"
                    onClick={toggleUserMenu}
                  >
                    <span>Create a Organization</span>
                    <span className="is-line-height-1 is-size-8 has-text-weight-semibold has-text-blue-600 ml-3">(NEW)</span>
                  </a>
                </Link>
                <Link href={PATHS.PROFILE}>
                  <a
                    aria-hidden="true"
                    type="button"
                    className="navbar-item has-text-weight-semibold is-uppercase"
                    onClick={toggleUserMenu}
                  >
                    Your Profile
                  </a>
                </Link>
                <Link href={PATHS.SUPPORT}>
                  <a aria-hidden="true" className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                    Support
                  </a>
                </Link>
                <hr className="navbar-divider" />
                {roles.map((role, item) => (
                  <OrganizationMenuItem role={role} toggleUserMenu={toggleUserMenu} key={`organization-${item}`} />
                ))}
                <div className="has-background-white p-15">
                  <Link href='/'>
                    <div className={clsx("is-flex is-flex-wrap-wrap is-align-items-center py-5", styles.organization)} onClick={toggleUserMenu}>
                      <Avatar
                        name={`${firstName} ${lastName}` || "User"}
                        src={avatarUrl}
                        size="35"
                        round
                        textSizeRatio={2.5}
                        className="mr-10"
                        maxInitials={2}
                      />
                      <div>
                        <p className="has-text-black-950 has-text-weight-semibold">{`${firstName} ${lastName}`}</p>
                        <p className="has-text-weight-semibold is-uppercase has-text-gray-500 is-size-9">Personal Account</p>
                      </div>
                    </div>
                  </Link>
                </div>
                <span
                  aria-hidden="true"
                  role="button"
                  className="navbar-item is-hidden-desktop"
                  style={{ cursor: 'pointer' }}
                  onClick={handleLogout}
                  tabIndex={0}
                >
                  Sign out
                </span>
              </div>
              <div className="navbar-end is-hidden-touch is-flex is-align-items-center">
                {/* Right icon menu - desktop */}
                {!isWaitlist ? (
                  <HeaderMenu
                    handleLogout={handleLogout}
                    user={user}
                  />
                )
                  : null}
              </div>
            </div>
          ) : (
            <div className="navbar-menu" ref={menu}>
              {/* Desktop menu */}
              {/* <div
                className="navbar-start is-hidden-mobile is-hidden-tablet-only is-flex-grow-1"
              >
                <Link href="/guides">
                  <a aria-hidden="true" className={`navbar-item has-text-black-950 mx-25 ${pathname.includes('/engineering') ? 'has-text-weight-semibold' : ''}`} onClick={toggleHamburger}>
                    Community Eng Guides
                  </a>
                </Link>
              </div> */}
              {/* Hamburger menu (mobile & tablet) */}
              {/* <div className="navbar-start is-hidden-desktop">
                <Link href="/guides">
                  <a className="navbar-item has-text-weight-semibold is-uppercase" aria-hidden="true" onClick={toggleHamburger}>
                    Community Engineering Guides
                  </a>
                </Link>
                <hr className="navbar-divider" />
              </div> */}
            </div>
          )
        }
      </nav>
    </header>
  );
}

export default Header;
