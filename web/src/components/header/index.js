import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './header.module.scss';
import { authOperations } from '../../state/features/auth';

const Header = (props) => {
  const dispatch = useDispatch();
  const { deauthenticate } = authOperations;

  // Create REFs for menus
  const burger = useRef(null);
  const menu = useRef(null);
  const userMenu = useRef(null);

  // Get auth state
  const auth = useSelector((state) => state.authState);
  const { user, token } = auth;
  const { firstName = '', lastName = '', is_admin: isAdmin = false } = user;
  const userInitials = (user) ? `${firstName.charAt(0)}${lastName.charAt(0)}` : '';

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

  const toggleMenu = () => {
    if (menu.current) {
      if (menu.current.classList.contains('is-active')) {
        menu.current.classList.remove('is-active');
      } else {
        menu.current.classList.add('is-active');
      }
    }
  };

  const toggleUserMenu = () => {
    if (userMenu.current) {
      if (userMenu.current.classList.contains('is-active')) {
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

  return (
    <header>
      <nav className="navbar is-transparent" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link href="/">
            <img src="/img/sema-logo.svg" alt="Logo" />
          </Link>

          {(token) &&
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
          }
        </div>

        <div className="navbar-menu" ref={menu}>
          {/* Hamburger menu (mobile & tablet) */}
          <div className="navbar-start is-hidden-desktop">
            <Link href="/profile"><a className="navbar-item" onClick={toggleHamburger}>Nav item</a></Link>
            <Link href="/account"><a className="navbar-item" onClick={toggleHamburger}>Nav item</a></Link>
            <Link href="/about"><a className="navbar-item" onClick={toggleHamburger}>Nav item</a></Link>
            <Link href="/faq"><a className="navbar-item" onClick={toggleHamburger}>Another nav item</a></Link>
            <hr className="navbar-divider" />
            {isAdmin &&
              <Link href="/admin"><a className="navbar-item" onClick={toggleHamburger}>Admin Panel</a></Link>
            }
            <span
              role="button"
              className="navbar-item"
              style={{ cursor: 'pointer' }}
              onClick={handleLogout}
              tabIndex={0}>Logout
            </span>
          </div>
          {(token) &&
          <div className="navbar-end is-hidden-mobile is-hidden-tablet-only">
            {/* Right icon menu - desktop */}
            <div className="navbar-item has-dropdown" style={{ marginRight: '0.7rem' }} ref={userMenu}>
              <div className="navbar-dropdown is-right">
                <Link href="/profile"><a className="navbar-item" onClick={toggleUserMenu}>Nav item</a></Link>
                <Link href="/account"><a className="navbar-item" onClick={toggleUserMenu}>Nav item</a></Link>
                <Link href="/about"><a className="navbar-item" onClick={toggleUserMenu}>Nav item</a></Link>
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
              <div className="buttons">
                {/* User menu */}
                <button
                  type="button"
                  className="button is-primary is-rounded"
                  style={{ width: '3rem', height: '3rem', paddingLeft: '0.5rem', paddingRight: '0.5rem', marginRight: '1rem' }}
                  onClick={toggleUserMenu}
                  ref={userMenu}>
                  <strong>{userInitials}</strong>
                </button>
              </div>
            </div>
          </div>
          }
        </div>
      </nav>
    </header>
  );
};

export default Header;
