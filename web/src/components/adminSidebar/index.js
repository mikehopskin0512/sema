import React from 'react';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './adminSidebar.module.scss';
import {
  AuthorIcon,
  CodeStatsIcon,
  FileIcon,
  GridIcon,
  MailIcon,
} from '../Icons';
import Logo from '../Logo';
import { PATHS } from '../../utils/constants';
import { white0 } from '../../../styles/_colors.module.scss';

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

const AdminSidebar = () => {
  const menus = [
    {
      name: 'Dashboard (coming)',
      pathName: PATHS.DASHBOARD,
      icon: <GridIcon color={white0} size="small" />,
    },
    {
      name: 'User Management',
      pathName: '/sema-admin/users',
      icon: <AuthorIcon color={white0} size="small" />,
    },
    {
      name: 'Invites',
      pathName: '/sema-admin/invites',
      icon: <MailIcon color={white0} size="small" />,
    },
    {
      name: 'Reports',
      pathName: '/sema-admin/reports',
      icon: <FileIcon color={white0} size="small" />,
    },
    {
      name: 'Smart Comment Metrics',
      pathName: '/sema-admin/smart-comments',
      icon: <CodeStatsIcon color={white0} size="small" />,
    },
  ];
  return (
    <div
      className={clsx(
        styles.sidebar,
        'p-10 is-flex is-flex-direction-column is-relative is-fullheight',
      )}
    >
      <div
        className="is-flex is-align-items-center is-clickable p-10"
        onClick={() => Router.push(PATHS.DASHBOARD)}
        aria-hidden="true"
      >
        <Logo theme="dark" shape="horizontal" />
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

export default AdminSidebar;
