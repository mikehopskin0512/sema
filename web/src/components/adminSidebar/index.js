import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import styles from './adminSidebar.module.scss';

const MenuItem = ({ pathName, icon, name }) => {
  const router = useRouter();

  const isActiveRoute = () => router.asPath === pathName;

  return (
    <Link href={pathName}>
      <a
        className={clsx(
          styles['menu-item'],
          isActiveRoute(pathName) && styles.active,
          'is-flex is-align-items-center mb-10 is-clickable',
        )}
      >
        {icon}
        <span className={clsx(styles['label-menu'], 'has-text-white ml-15')}>
          {name}
        </span>
      </a>
    </Link>
  );
};

MenuItem.propTypes = {
  pathName: PropTypes.string.isRequired,
  icon: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
};

const AdminSidebar = ({ open, setOpen }) => {
  const menus = [
    {
      name: 'Dashboard',
      pathName: '/dashboard',
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
      name: 'Reports',
      pathName: '/sema-admin/reports',
      icon: <img src="/img/icons/dashboard.png" alt="" />,
    },
    {
      name: 'Smart Comments',
      pathName: '/sema-admin/smart-comments',
      icon: <img src="/img/icons/dashboard.png" alt="" />,
    },
  ];
  return (
    <div
      className={clsx(
        styles.sidebar,
        styles[open ? 'open' : 'close'],
        'p-10 is-flex is-flex-direction-column is-relative is-fullheight',
      )}
    >
      <div
        className={`is-flex is-align-items-center is-clickable ${
          open ? 'p-10' : 'px-5 py-10'
        }`}
        onClick={() => Router.push('/dashboard')}
        aria-hidden="true"
      >
        <img src="/img/logo_short.png" alt="logo" />
        {open && <span className="has-text-white is-size-4 ml-10">sema</span>}
      </div>
      <div className="is-flex is-flex-direction-column is-justify-content-space-between mt-25">
        {menus.map((item) => (
          <MenuItem
            key={item.pathName}
            pathName={item.pathName}
            name={item.name}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
};

AdminSidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default AdminSidebar;
