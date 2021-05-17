import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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
    <div className={`sidebar ${open ? 'open' : 'close'}`}>
      <div className="logo-wrapper" onClick={() => setOpen(!open)}>
        <img src="/img/logo_short.png" alt="logo" />
        {
          open && <span>sema</span>
        }
      </div>
      <div className="menu">
        <Link href="/admin/dashboard">
          <a className="menu-item">
            <img src="/img/icons/dashboard.png" alt="" />
            <span className="label-menu">Dashboard</span>
          </a>
        </Link>
        <Link href="/admin/users">
          <a className="menu-item active">
            <img src="/img/icons/users.png" alt="" />
            <span className="label-menu">User Management</span>
          </a>
        </Link>
        <Link href="/admin/settings">
          <a className="menu-item bottom">
            <img src="/img/icons/settings.png" alt="" />
            <span className="label-menu">Settings</span>
          </a>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
