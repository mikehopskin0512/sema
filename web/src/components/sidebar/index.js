import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import styles from './sidebar.module.scss';

const MenuItem = ({ pathName, icon, name }) => {
  const router = useRouter();

  const isActiveRoute = () => router.asPath === pathName;

  return (
    <Link href={pathName}>
      <a className={clsx(styles['menu-item'], isActiveRoute(pathName) && styles.active, 'is-flex is-align-items-center mb-10 is-clickable')}>
        { icon }
        <span className={clsx(styles['label-menu'], 'has-text-white ml-15')}>{ name }</span>
      </a>
    </Link>
  )
};

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

  const menus = [
    {
      name: 'Dashboard',
      pathName: '/sema-admin/dashboard',
      icon: <img src="/img/icons/dashboard.png" alt="" />,
    },
    {
      name: 'User Management',
      pathName: '/sema-admin/users',
      icon: <img src="/img/icons/users.png" alt="" />,
    },
    {
      name: 'Invites',
      pathName: '/sema-admin/invites',
      icon: <img src="/img/icons/dashboard.png" alt="" />,
    },
    {
      name: 'Settings',
      pathName: '/sema-admin/settings',
      icon: <FontAwesomeIcon icon='cog' size='lg' className="has-text-white" />,
    },
  ];
  return (
    <div className={clsx(styles.sidebar, styles[open ? 'open' : 'close'], `p-10 is-flex is-flex-direction-column is-relative is-fullheight`)}>
      <div className={`is-flex is-align-items-center is-clickable ${open ? 'p-10' : 'px-5 py-10'}`} onClick={() => setOpen(!open)}>
        <img src="/img/logo_short.png" alt="logo" />
        {
          open && <span className="has-text-white is-size-4 ml-10">sema</span>
        }
      </div>
      <div className="is-flex is-flex-direction-column is-justify-content-space-between mt-25">
        {
          menus.map(item => (
            <MenuItem key={item.pathName} pathName={item.pathName} name={item.name} icon={item.icon} />
          ))
        }
      </div>
    </div>
  );
};

export default Sidebar;
