import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import Link from 'next/link';
import Avatar from 'react-avatar';
import styles from '../header.module.scss';
import TeamMenuItem from '../TeamMenuIteam';
import useOutsideClick from '../../../utils/useOutsideClick';

const HeaderMenu = ({
  handleLogout,
  user,
}) => {
  const userMenu = useRef(null);
  const {
    firstName = '',
    lastName = '',
    avatarUrl,
    roles = [],
  } = user;
  const fullName = `${firstName} ${lastName}`;

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

  return(
    <div className={clsx("navbar-item has-dropdown", styles.team)} ref={userMenu}>
      <div className="navbar-dropdown is-right p-0 border-radius-8px" style={{ border: '1px #f3f3f3 solid', minWidth: 230, background: '#F9F9F9' }}>
        { roles.map((role, item) => (
          <TeamMenuItem role={role} toggleUserMenu={toggleUserMenu} key={`team-${role}`} />
        )) }
        <hr className={clsx("navbar-divider m-0", styles.divider)} />
        <Link href="/profile">
          <span
            role="button"
            className="navbar-item px-15 py-20"
            onClick={toggleUserMenu}
            aria-hidden="true"
          >
            Profile
          </span>
        </Link>
        <hr className={clsx("navbar-divider m-0", styles.divider)} />
        <span
          role="button"
          className="navbar-item has-text-red px-15 py-20"
          style={{ cursor: 'pointer' }}
          onClick={handleLogout}
          tabIndex={0}
          aria-hidden="true"
        >
          Sign out
        </span>
      </div>
      {/* User menu */}
      <a aria-hidden="true" className="navbar-link is-arrowless mx-20" onClick={toggleUserMenu} ref={userMenu}>
        <div className="is-flex is-align-items-center">
          <Avatar
            name={fullName}
            src={avatarUrl || null}
            size="30"
            round
            textSizeRatio={2.5}
          />
          <FontAwesomeIcon icon={faSortDown} size="lg" className="mt-neg8 ml-8" />
        </div>
      </a>
    </div>
  )
}

export default HeaderMenu;