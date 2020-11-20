import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from 'react-avatar';
import './header.module.scss';
import { authOperations } from '../../state/features/auth';
import Logo from '../../../public/img/Sema-logo-black.svg';
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
    firstName = '', lastName = '', avatarUrl,
    isVerified = false, organizations = [],
  } = user;
  const fullName = `${firstName} ${lastName}`;
  // Initials replaced by react-avatar
  // const userInitials = (user) ? `${firstName.charAt(0)}${lastName.charAt(0)}` : '';

  // Use 1st org (for now) and get isAdmin
  const [currentOrg = {}] = organizations;
  const { isAdmin = false } = currentOrg;

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
      if (userMenu.current.classList.contains('is-active') || status === false) {
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
    <header className="has-background-primary">
      <nav className="navbar is-transparent" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link href="/reports"><a><Logo className="logo" fill="#FFFFFF" /></a></Link>
          {(token && isVerified) && (
            <button
              onClick={toggleHamburger}
              type="button"
              className="navbar-burger burger"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
              ref={burger}>
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          )}
        </div>
        {(token && isVerified) && (
          <div className="navbar-menu" ref={menu}>
            {/* Desktop menu */}
            <div className="navbar-start is-hidden-mobile is-hidden-tablet-only">
              <Link href="/reports"><a className="navbar-item has-text-white is-uppercase is-family-monospace" onClick={toggleHamburger}>Dashboard</a></Link>
              <Link href="/"><a className="navbar-item has-text-white is-uppercase is-family-monospace" onClick={toggleHamburger}>Projects</a></Link>
              <Link href="/repositories"><a className="navbar-item has-text-white is-uppercase is-family-monospace" onClick={toggleHamburger}>Repositories</a></Link>
              <Link href="/"><a className="navbar-item has-text-white is-uppercase is-family-monospace" onClick={toggleHamburger}>Teams</a></Link>
              <Link href="/"><a className="navbar-item has-text-white is-uppercase is-family-monospace" onClick={toggleHamburger}>Reports</a></Link>
            </div>
            {/* Hamburger menu (mobile & tablet) */}
            <div className="navbar-start is-hidden-desktop">
              <Link href="/reports"><a className="navbar-item" onClick={toggleHamburger}>Dashboard</a></Link>
              <Link href="/"><a className="navbar-item" onClick={toggleHamburger}>Projects</a></Link>
              <Link href="/repositories"><a className="navbar-item" onClick={toggleHamburger}>Repositories</a></Link>
              <Link href="/"><a className="navbar-item" onClick={toggleHamburger}>Teams</a></Link>
              <Link href="/"><a className="navbar-item" onClick={toggleHamburger}>Reports</a></Link>
              <hr className="navbar-divider" />
              {isAdmin &&
                <Link href="/admin"><a className="navbar-item" onClick={toggleHamburger}>Admin Panel</a></Link>}
              <span
                role="button"
                className="navbar-item is-hidden-desktop"
                style={{ cursor: 'pointer' }}
                onClick={handleLogout}
                tabIndex={0}>Logout
              </span>
            </div>
            <div className="navbar-end is-hidden-mobile is-hidden-tablet-only">
              {/* Right icon menu - desktop */}
              <div className="navbar-item has-dropdown" ref={userMenu}>
                <div className="navbar-dropdown is-right">
                  <Link href="/"><a className="navbar-item" onClick={toggleUserMenu}>User menu item</a></Link>
                  <Link href="/"><a className="navbar-item" onClick={toggleUserMenu}>User menu item</a></Link>
                  <Link href="/"><a className="navbar-item" onClick={toggleUserMenu}>User menu item</a></Link>
                  <hr className="navbar-divider" />
                  {isAdmin &&
                    <Link href="/admin"><a className="navbar-item" onClick={toggleUserMenu}>Admin Panel</a></Link>
                  }
                  <span
                    role="button"
                    className="navbar-item"
                    style={{ cursor: 'pointer' }}
                    onClick={handleLogout}
                    tabIndex={0}>Logout
                  </span>
                </div>
                {/* User menu */}
                <button
                  type="button"
                  className="button user-menu"
                  onClick={toggleUserMenu}
                  ref={userMenu}>
                  <Avatar
                    className="mr-10"
                    name={fullName}
                    src={avatarUrl || null}
                    // githubHandle={githubHandle || null}
                    size="30"
                    round
                    color="#4974a5"
                    textSizeRatio={2.5} />
                  <span className="mr-10 is-uppercase"><strong>{fullName}</strong></span>
                  <FontAwesomeIcon icon={['fas', 'angle-down']} style={{ fontSize: '24px' }} />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
