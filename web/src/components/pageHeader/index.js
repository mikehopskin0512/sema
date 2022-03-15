import React from 'react';
import Avatar from 'react-avatar';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { EditIcon } from '../Icons';
import styles from './pageHeader.module.scss';
import usePermission from '../../hooks/usePermission';
import { PATHS } from '../../utils/constants';

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

  const goToEditPage = () => {
    router.push(PATHS.TEAM.EDIT(team?._id));
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
          <div className="ml-20">
            <p className="has-text-weight-semibold has-text-black-950 is-size-4 mb-5">
              {team?.name || ''}
            </p>
            <div className="has-text-gray-600">{team?.description}</div>
          </div>
        </div>
        {checkAccess(team?._id, 'canEditUsers') && type === 'normal' && (
          <div className='is-flex'>
            <button
              className="button has-background-white has-text-primary border-none border-radius-4px outline-none"
              type="button"
              onClick={goToEditPage}
            >
              <EditIcon size="small" />
              <span className="ml-10">Edit Team Profile</span>
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
                  <a className={clsx('is-size-6 has-text-weight-semibold is-flex is-align-items-center mr-20 px-0 py-4', isActive(item) ? styles.active : 'border-none', styles.listItem)}>
                    {item.icon}
                    <span className="ml-8">{item.name}</span>
                  </a>
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
