import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Avatar from 'react-avatar';
import './header.module.scss';
import { authOperations } from '../../state/features/auth';
import useOutsideClick from '../../utils/useOutsideClick';

const Header = () => {
  const dispatch = useDispatch();
  const { deauthenticate } = authOperations;

  // Create REFs for menus
  const burger = useRef(null);
  const menu = useRef(null);
  const userMenu = useRef(null);

  // Get auth state
  const auth = useSelector((state) => state.authState);
  const { user, token } = auth;
  const {
    firstName = '',
    lastName = '',
    avatarUrl,
    isVerified = false,
    organizations = [],
  } = user;
  const fullName = `${firstName} ${lastName}`;
  // Initials replaced by react-avatar
  // const userInitials = (user) ? `${firstName.charAt(0)}${lastName.charAt(0)}` : '';

  // Use 1st org (for now) and get isAdmin
  const [currentOrg = {}] = organizations;
  const { isAdmin = false } = currentOrg;

  const orgMenuList = organizations.map((org) => (
    <Link href="/reports">
      <a className="navbar-item">{org.orgName}</a>
    </Link>
  ));

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
    toggleUserMenu();
    dispatch(deauthenticate());
  };

  const onClickOutside = () => {
    toggleUserMenu(false);
  };

  // Check for clicks outside of userMenu
  useOutsideClick(userMenu, onClickOutside);

  return (
    <header className="has-background-white">
      <nav
        className="navbar is-transparent"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <Link href="/reports">
            <a>
              <img src='/img/sema-logo.png' alt="sema-logo" />
            </a>
          </Link>
          {token && isVerified && (
            <button
              onClick={toggleHamburger}
              type="button"
              className="navbar-burger burger"
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
        {token && isVerified && (
          <div className="navbar-menu" ref={menu}>
            {/* Desktop menu */}
            {/* <div
              className="navbar-start is-hidden-mobile is-hidden-tablet-only is-flex-grow-1 is-justify-content-flex-end"
            >
              <Link href="/invite">
                <a className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                  Dashboard
                </a>
              </Link>
              <Link href="/">
                <a className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                  Projects
                </a>
              </Link>
              <Link href="/repositories">
                <a className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                  Repositories
                </a>
              </Link>
              <Link href="/">
                <a className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                  Teams
                </a>
              </Link>
              <Link href="/reports">
                <a className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                  Reports
                </a>
              </Link>
            </div> */}
            {/* Hamburger menu (mobile & tablet) */}
            <div className="navbar-start is-hidden-desktop">
              {/* <Link href="/invite">
                <a className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                  Dashboard
                </a>
              </Link>
              <Link href="/">
                <a className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                  Projects
                </a>
              </Link>
              <Link href="/repositories">
                <a className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                  Repositories
                </a>
              </Link>
              <Link href="/">
                <a className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                  Teams
                </a>
              </Link>
              <Link href="/reports">
                <a className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                  Reports
                </a>
              </Link>
              <hr className="navbar-divider" />
              {isAdmin && (
                <Link href="/admin">
                  <a className="navbar-item has-text-weight-semibold is-uppercase" onClick={toggleHamburger}>
                    Admin Panel
                  </a>
                </Link>
              )} */}
              <span
                role="button"
                className="navbar-item is-hidden-desktop"
                style={{ cursor: 'pointer' }}
                onClick={handleLogout}
                tabIndex={0}
              >
                Logout
              </span>
            </div>
            <div className="navbar-end is-hidden-mobile is-hidden-tablet-only">
              {/* Right icon menu - desktop */}
              <div className="navbar-item has-dropdown" ref={userMenu}>
                <div className="navbar-dropdown is-right">
                  <div className="nested navbar-item dropdown">
                    <div className="dropdown-trigger">
                      <a
                        // className="has-text-white"
                        aria-haspopup="true"
                        aria-controls="dropdown-menu"
                      >
                        Switch Organization
                      </a>
                    </div>
                    <div
                      className="dropdown-menu"
                      id="dropdown-menu"
                      role="menu"
                    >
                      <div className="navbar-dropdown is-right">
                        {orgMenuList}
                        <hr className="navbar-divider has-background-grey-lighter" />
                        <Link href="/register/organization">
                          <a className="navbar-item">Create New Organization</a>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <Link href="/">
                    <a className="navbar-item" onClick={toggleUserMenu}>
                      My Account
                    </a>
                  </Link>
                  <hr className="navbar-divider has-background-grey-lighter" />
                  {isAdmin && (
                    <Link href="/admin">
                      <a
                        type="button"
                        className="navbar-item"
                        onClick={toggleUserMenu}
                      >
                        Admin Panel
                      </a>
                    </Link>
                  )}
                  <span
                    role="button"
                    className="navbar-item"
                    style={{ cursor: 'pointer' }}
                    onClick={handleLogout}
                    tabIndex={0}
                    aria-hidden="true"
                  >
                    Logout
                  </span>
                </div>
                {/* User menu */}
                <a className="navbar-link " onClick={toggleUserMenu} ref={userMenu}>
                  <span className="mr-10">{firstName}</span>
                  <Avatar
                    className="mr-10"
                    name={fullName}
                    src={avatarUrl || null}
                    // githubHandle={githubHandle || null}
                    size="30"
                    round
                    textSizeRatio={2.5}
                  />
                </a>
                {/* <button
                  type="button"
                  className="button user-menu"
                  onClick={toggleUserMenu}
                  ref={userMenu}
                >
                  <span className="mr-10">{firstName}</span>
                  <Avatar
                    className="mr-10"
                    name={fullName}
                    src={avatarUrl || null}
                    // githubHandle={githubHandle || null}
                    size="30"
                    round
                    textSizeRatio={2.5}
                  />
                </button> */}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
