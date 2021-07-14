import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faListAlt, faChartPie, } from '@fortawesome/free-solid-svg-icons'

import styles from "./sidebar.module.scss";

const MenuItem = ({ pathName, icon, name }) => {
  const router = useRouter();

  const isActiveRoute = () => router.asPath.includes(pathName);

  return (
    <Link href={pathName}>
      <a className={clsx(styles['menu-item'], isActiveRoute(pathName) && styles.active, 'is-flex is-align-items-center mb-10 is-clickable')}>
        <FontAwesomeIcon
          className='is-clickable'
          icon={icon}
        />
        <span className={clsx(styles['label-menu'], 'ml-15')}>{name}</span>
      </a>
    </Link>
  )
};

const Sidebar = ({ children }) => {

  const [menus] = useState([
    {
      name: 'Overview',
      pathName: '/overview',
      icon: faHome
    },
    {
      name: 'Activity Logs',
      pathName: '/activity',
      icon: faListAlt
    },
    {
      name: 'Code Stats',
      pathName: '/stats',
      icon: faChartPie,
    },
  ]);

  return (
    <div className={clsx(styles['layout-container'])}>
      <div className="columns m-0">
        <div className="column is-one-fifth">
          <div className={clsx(styles.sidebar, "ml-90 p-10 is-flex is-flex-direction-column is-relative is-fullheight")}>
            <div className="is-flex is-flex-direction-column is-justify-content-space-between mt-25">
              {
                menus.map(item => (
                  <MenuItem key={item.pathName} pathName={item.pathName} name={item.name} icon={item.icon} />
                ))
              }
            </div>
          </div>
        </div>
        <div className="column m-50">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
