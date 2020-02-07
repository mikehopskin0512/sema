import { useState, useRef } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./style.scss";

const linkStyle = {
  marginRight: 15
};

const isAuthenticated = true;
const isAdmin = false;
const userInitials = 'JR';

const Header = () => {
  const burger = useRef(null);
  const menu = useRef(null);
  const userMenu = useRef(null);
  const helpMenu = useRef(null);


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
    // Hide user menu if help menu
    if (helpMenu.current) {
      helpMenu.current.classList.remove('is-active');
    }

    if (userMenu.current) {
      if (userMenu.current.classList.contains('is-active')) {
        userMenu.current.classList.remove('is-active');
      } else {
        userMenu.current.classList.add('is-active');
      }
    }
  };  

  const handleLogout = () => {
    toggleMenu();
    //props.logout();
  };  
 
  return (
    <header>
      <nav className="navbar is-transparent" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link href="/">
            <img src="/img/sema-logo.svg" alt="Logo" />
          </Link>

          {(isAuthenticated) &&
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
              <Link to="/admin"><a className="navbar-item" onClick={toggleHamburger}>Admin Panel</a></Link>
            }
            <span
              role="button"
              className="navbar-item"
              style={{ cursor: 'pointer' }}
              onClick={handleLogout}
              tabIndex={0}>Logout
            </span>
          </div>
          {(isAuthenticated) &&
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
