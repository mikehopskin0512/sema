import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { ActivityLogIcon, CodeStatsIcon } from '../Icons';

import styles from './sidebar.module.scss';

function MenuItem({ pathName, icon, name, selectedTab, setSelectedTab }) {
  return (
    <div
      className={clsx(
        styles['menu-item'],
        selectedTab === pathName && styles.active,
        'py-5 mr-30 is-size-6 has-text-weight-semibold is-flex is-align-items-center is-justify-content-flex-start is-clickable'
      )}
      onClick={() => setSelectedTab(pathName)}
    >
      {icon}
      <span className={clsx(styles['label-menu'], 'ml-8')}>{name}</span>
    </div>
  );
}

MenuItem.propTypes = {
  pathName: PropTypes.string.isRequired,
  icon: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  selectedTab: PropTypes.string.isRequired,
  setSelectedTab: PropTypes.func.isRequired,
};

function Sidebar({ children, ...menuItemProps }) {
  return (
    <div className="px-20 is-flex">
      <div className="is-flex is-justify-content-space-between mt-10 is-flex-wrap-wrap">
      <MenuItem
          pathName="stats"
          name="Repo Insights"
          icon={<CodeStatsIcon />}
          {...menuItemProps}
        />
        
        <MenuItem
          pathName="activity"
          name="Activity Logs"
          icon={<ActivityLogIcon />}
          {...menuItemProps}
        />
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Sidebar;
