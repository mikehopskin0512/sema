import { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { ActivityLogIcon, CodeStatsIcon } from '../Icons';

import styles from './sidebar.module.scss';

const MenuItem = ({
  pathName, icon, name, selectedTab, setSelectedTab,
}) => (
  <div
    className={clsx(
      styles['menu-item'],
      selectedTab === pathName && styles.active,
      'py-5 mr-30 is-size-6 has-text-weight-semibold is-flex is-align-items-center is-justify-content-flex-start is-clickable',
    )}
    onClick={() => setSelectedTab(pathName)}
  >
    {icon}
    <span className={clsx(styles['label-menu'], 'ml-8')}>{name}</span>
  </div>
);

MenuItem.propTypes = {
  pathName: PropTypes.string.isRequired,
  icon: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  selectedTab: PropTypes.string.isRequired,
  setSelectedTab: PropTypes.func.isRequired,
};

const Sidebar = ({ children, ...menuItemProps }) => {
  const [menus] = useState([
    // {
    //   name: 'Overview',
    //   pathName: '/overview',
    //   icon: faHome,
    // },
    {
      name: 'Activity Logs',
      pathName: 'activity',
      icon: <ActivityLogIcon />,
    },
    {
      name: 'Code Stats',
      pathName: 'stats',
      icon: <CodeStatsIcon />,
    },
  ]);

  return (
    <div className="px-20 is-flex">
      <div className="is-flex is-justify-content-space-between mt-10 is-flex-wrap-wrap">
        {
          menus.map((item) => (
            <MenuItem key={item.pathName} pathName={item.pathName} name={item.name} icon={item.icon} {...menuItemProps} />
          ))
        }
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Sidebar;
