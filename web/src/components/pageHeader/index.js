import React from 'react';
import Avatar from 'react-avatar';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { PlusIcon } from '../Icons';
import styles from './pageHeader.module.scss';
import Logo from '../Logo';
import usePermission from '../../hooks/usePermission';
import { PATHS, SEMA_CORPORATE_TEAM_ID } from '../../utils/constants';


const defaultMenus = [
  {
    name: 'Repos',
    path: '/repos',
  },
  {
    name: 'Snippets',
    path: '/repos',
  },
  {
    name: 'Community Engineering Guides',
    path: '/repos',
  },
  {
    name: 'Team Management',
    path: '/repos',
  },
  {
    name: 'Settings',
    path: '/repos',
  },
];

const PageHeader = ({ menus = defaultMenus, userRole = {}, type = 'normal' }) => {
  const router = useRouter();
  const { pathname: routerPathname } = router;
  const { checkAccess } = usePermission();

  const isActive = (pathname) => {
    return pathname === routerPathname;
  }

  const goToInvitePage = () => {
    router.push(PATHS.TEAM.INVITE);
  };

  return (
    <div className="content-container px-20 mb-25">
      <div className="is-flex mb-25">
        <Avatar
          name={userRole?.team?.name || "Team"}
          src={userRole?.team?.avatarUrl}
          size="35"
          round
          textSizeRatio={2.5}
          className=""
          maxInitials={2}
        />
        <p className="has-text-weight-semibold has-text-black-950 is-size-5 ml-20">
          {userRole?.team?.name || ''}
        </p>
      </div>
      <div>
        <div className="tabs">
          <ul className={styles.wrapper}>
            {
              menus.map((item) => (
                <li key={item.name} className={isActive(item.name) ? 'is-active' : ''}>
                  <a className={clsx(isActive(item.pathname) ? styles.active : '', styles.listItem)}>{item.name}</a>
                </li>
              ))
            }
          </ul>
        </div>

        {checkAccess(SEMA_CORPORATE_TEAM_ID, 'canEditUsers') && type === 'normal' && (
          <button
            className="button is-small is-primary border-radius-4px"
            type="button"
            onClick={goToInvitePage}
          >
            <PlusIcon size="small" />
            <span className="ml-10">Invite new members</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
