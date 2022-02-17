/* eslint-disable jsx-a11y/anchor-is-valid */
import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import Link from 'next/link';
import Avatar from 'react-avatar';
import styles from './header.module.scss';
import HeaderMenu from './HeaderMenu';
import TeamMenuItem from './TeamMenuItem';
import useOutsideClick from '../../utils/useOutsideClick';
import SupportForm from '../supportForm';
import SignOutModal from '../signOutModal';
import usePermission from '../../hooks/usePermission';
import { teamsOperations } from '../../state/features/teams';
import { portfoliosOperations } from '../../state/features/portfolios';
import Logo from '../Logo';
import { PATHS } from '../../utils/constants';
import useAuthEffect from '../../hooks/useAuthEffect';
import UserHeaderNav from './UserHeaderNav';

const { fetchTeamsOfUser } = teamsOperations;
const { fetchPortfoliosOfUser } = portfoliosOperations;

const Header = () => {
  const dispatch = useDispatch();
  const [supportForm, setSupportForm] = useState(false);
  const [signOutModal, setSignOutModal] = useState(false);
  const { checkAccess, isSemaAdmin } = usePermission();

  // Create REFs for menus
  const burger = useRef(null);
  const menu = useRef(null);
  const userMenu = useRef(null);

  // Get auth state
  const auth = useSelector((state) => state.authState);

  const { user, token, selectedTeam } = auth;
  const {
    isVerified = false,
    organizations = [],
    isWaitlist = true,
    inviteCount = 0,
    roles = [],
    avatarUrl,
    firstName = '',
    lastName = '',
  } = user ?? {};
  // Initials replaced by react-avatar
  // const userInitials = (user) ? `${firstName.charAt(0)}${lastName.charAt(0)}` : '';

  // Use 1st org (for now) and get isAdmin
  // const [currentOrg = { isAdmin: false }] = organizations;

  const openSupportForm = () => setSupportForm(true);
  const closeSupportForm = () => setSupportForm(false);

  const orgMenuList = organizations.map((org) => (
    <Link href="/">
      <a className="navbar-item">{org.orgName}</a>
    </Link>
  ));

  useAuthEffect(() => {
    dispatch(fetchTeamsOfUser(token));
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
        className="navbar is-transparent container"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <Link href="/">
            <a className="is-flex is-align-items-center">
              <Logo shape="horizontal" width={100} height={34} />
            </a>
          </Link>
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
                className="navbar-start is-hidden-mobile is-hidden-tablet-only is-flex-grow-1 mx-30"
              >
                <UserHeaderNav
                  toggleHamburger={toggleHamburger}
                  isSemaAdmin={isSemaAdmin}
                  type='desktop'
                  inviteCount={inviteCount}
                  selectedTeam={selectedTeam}
                />
              </div>
              {/* Hamburger menu (mobile & tablet) */}
              <div className="navbar-start is-hidden-desktop">
                <UserHeaderNav
                  toggleHamburger={toggleHamburger}
                  isSemaAdmin={isSemaAdmin}
                  type='mobile'
                  inviteCount={inviteCount}
                  selectedTeam
                />
                <hr className="navbar-divider" />
                <Link href={PATHS.TEAM._}>
                  <a
                    aria-hidden="true"
                    type="button"
                    className="navbar-item has-text-weight-semibold is-uppercase"
                    onClick={toggleUserMenu}
                  >
                    <span>Create a Team</span>
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
                  <TeamMenuItem role={role} toggleUserMenu={toggleUserMenu} key={`team-${item}`} />
                ))}
                <div className="has-background-white p-15">
                  <Link href='/'>
                    <div className={clsx("is-flex is-flex-wrap-wrap is-align-items-center py-5", styles.team)} onClick={toggleUserMenu}>
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
};

export default Header;
