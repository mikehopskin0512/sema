import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import styles from './sidebar.module.scss';

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const isMenuOpen = localStorage.getItem('semo_menu_open');
    if (isMenuOpen) {
      setOpen(JSON.parse(isMenuOpen));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('semo_menu_open', JSON.stringify(open));
  }, [open]);

  return (
    <div className={clsx(styles.sidebar, styles[open ? 'open' : 'close'], `p-10 is-flex is-flex-direction-column is-relative is-full-height`)}>
      <div className={`is-flex is-align-items-center is-clickable ${open ? 'p-10' : 'px-5 py-10'}`} onClick={() => setOpen(!open)}>
        <img src="/img/logo_short.png" alt="logo" />
        {
          open && <span className="has-text-white is-size-4 ml-10">sema</span>
        }
      </div>
      <div className="is-flex is-flex-direction-column is-justify-content-space-between mt-25">
        <Link href="/admin/dashboard">
          <a className={clsx(styles['menu-item'], 'is-flex is-align-items-center mb-10 is-clickable')}>
            <img src="/img/icons/dashboard.png" alt="" />
            <span className={clsx(styles['label-menu'], 'has-text-white ml-15')}>Dashboard</span>
          </a>
        </Link>
        <Link href="/sema-admin/users">
          <a className={clsx(styles['menu-item'], styles.active, 'is-flex is-align-items-center mb-10 is-clickable')}>
            <img src="/img/icons/users.png" alt="" />
            <span className={clsx(styles['label-menu'], 'has-text-white ml-15')}>User Management</span>
          </a>
        </Link>
        <Link href="/admin/settings">
          <a className={clsx(styles['menu-item'], styles['bottom'], 'is-flex is-align-items-center mb-10 is-clickable')}>
            <FontAwesomeIcon icon='cog' size='lg' className="has-text-white" />
            <span className={clsx(styles['label-menu'], 'has-text-white ml-15')}>Settings</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
