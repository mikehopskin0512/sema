import { useRouter } from 'next/router';
import React from 'react';
import clsx from 'clsx';
import styles from './pageTabs.module.scss';

const pageTabs = ({ tabs }) => {
  const router = useRouter();
  const { asPath, query: { tab } } = router;
  const isActive = (path) => path === asPath;

  return (
    <ul className="is-flex">
      {tabs.map(({ id, icon, label, path }) => (
        <li
          key={id}
          className={clsx(
            'is-size-6 has-text-weight-semibold is-flex is-align-items-center mr-20 px-0 py-4 is-cursor-pointer',
            styles.item,
            isActive(path) && styles.active,
          )}
          onClick={() => router.push(path)}
        >
          {icon}
          <span className="ml-8">{label}</span>
        </li>
      ))}
    </ul>
  );
};

export default pageTabs;
