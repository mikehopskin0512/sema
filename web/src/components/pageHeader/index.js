import React from 'react';
import Avatar from 'react-avatar';
import { useRouter } from 'next/router';
import { EditIcon } from '../Icons';
import PageTabs from '../pageTabs';
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
  const { isTeamAdmin } = usePermission();
  const { team } = userRole;

  const goToEditPage = () => {
    router.push(PATHS.ORGANIZATIONS.EDIT(team?._id));
  };

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
        {isTeamAdmin() && (
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
      <PageTabs tabs={menus} />
    </div>
  );
};

export default PageHeader;
