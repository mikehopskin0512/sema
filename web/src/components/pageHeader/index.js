import React from 'react';
import clsx from 'clsx';
import styles from './pageHeader.module.scss';

const menus = [
  {
    name: 'Repos',
    path: '/repos',
  },
  {
    name: 'Suggested Comments',
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

const PageHeader = () => {
  const isActive = (path) => {
    return path === 'Repos';
  };

  return (
    <div className="content-container px-20 mb-25">
      <div className="is-flex mb-25">
        <img src="/img/logo_rect.png" alt="logo" />
        <p className="has-text-weight-semibold has-text-deep-black is-size-5 ml-20">
          Calendly Front End Admin
        </p>
      </div>
      <div>
        <div className="tabs">
          <ul className={styles.wrapper}>
            {
              menus.map((item) => (
                <li key={item.name} className={isActive(item.name) ? 'is-active' : ''}>
                  <a className={clsx(isActive(item.name) ? styles.active : '', styles.listItem)}>{item.name}</a>
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
