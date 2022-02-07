import React from 'react';
import Avatar from 'react-avatar';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { PlusIcon } from '../Icons';
import styles from './pageHeader.module.scss';
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
  const { pathname: routerpathname, query: { tab } } = router;
  const { checkAccess } = usePermission();
  const { team } = userRole;

  const isActive = (item) => {
    return tab ? item.tab === tab : item.path === routerpathname;
  }

  const goToInvitePage = () => {
    router.push(PATHS.TEAM.INVITE(team?._id));
  };

  const handleTabClick = (item) => {
    tab && router.push({
      pathname: item.path,
      query: { tab: item.tab },
    });
  }

  return (
    <div className="content-container px-10 mb-25">
      <div className='is-flex is-justify-content-space-between'>
        <div className="is-flex mb-25">
          <Avatar
            name={team?.name || "Team"}
            src={team?.avatarUrl}
            size="35"
            round
            textSizeRatio={2.5}
            maxInitials={2}
          />
          <p className="has-text-weight-semibold has-text-black-950 is-size-5 ml-20">
            {team?.name || ''}
          </p>
        </div>
        {checkAccess(team?._id, 'canEditUsers') && type === 'normal' && (
            <div className='is-flex'>
              <button
                className="button is-small is-primary border-radius-4px"
                type="button"
                onClick={goToInvitePage}
              >
                <PlusIcon size="small" />
                <span className="ml-10">Invite new members</span>
              </button>
            </div>
          )}
      </div>
      <div>
        <div className="tabs">
          <ul className={styles.wrapper}>
            {
              menus.map((item) => (
                <li key={item.name} className={isActive(item) ? 'is-active' : ''} onClick={() => handleTabClick(item)}>
                  <a className={clsx(isActive(item) ? styles.active : '', styles.listItem)}>{item.name}</a>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
