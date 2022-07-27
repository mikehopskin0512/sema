import React, { useEffect } from 'react';
import styles from './banners.module.scss';
import clsx from 'clsx';
import { CloseIcon } from '../../../Icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAppInstallBanner } from '../../../../state/features/auth/actions';
import { useRouter } from 'next/router';
import { PATHS } from '../../../../utils/constants';

export const GithubAppInstallBanner = () => {
  const { pathname } = useRouter();
  const { isAppInstallBanner } = useSelector(state => state.authState);
  const dispatch = useDispatch();

  const isShown = pathname.includes(PATHS.REPO) || pathname.includes(PATHS.REPOS) || pathname.includes(PATHS.DASHBOARD);

  useEffect(() => {
    if (!sessionStorage.getItem('is-app-install-banner')) {
      dispatch(toggleAppInstallBanner(true));
    } else {
      dispatch(toggleAppInstallBanner(false));
    }
  }, []);

  if (!isAppInstallBanner || !isShown) return null;

  return (<div className="has-background-blue-0">
  <div className="container">
    <div className={styles['promo-banner-wrapper']}>
      <div className={clsx('is-flex is-align-items-center', styles['promo-banner-section'])}>
        <p className={styles['promo-banner-text']}>Make Sync Faster! </p>
        <p className='has-text-black'>Improve the speed of Sema! Just Install Sema App!</p>
        <img src='/img/sync/sync-app-install.png' alt='Sync promo image'
             className={clsx(styles['promo-banner-img'], styles['promo-banner-img-app'])} />
      </div>
      <div className={clsx('is-flex is-align-items-center', styles['promo-banner-button-section'])}>
        <div>
          <button className='button is-primary is-bold mr-8' onClick={() => {
            window.open('https://github.com/apps/sema-assistant/installations/new', '_self');
          }}>
            Make Syncing Faster
          </button>
          <button className='button is-inverted is-outlined is-bold' onClick={() => {
            window.open('https://intercom.help/sema-software/en/articles/6411756-installing-the-sema-app-on-github', '_blank');
          }}>
            Learn More
          </button>
        </div>
        <span className='icon is-clickable has-text-dark' onClick={() => {
          dispatch(toggleAppInstallBanner(false));
          sessionStorage.setItem('is-app-install-banner', 'true');
        }}>
          <CloseIcon size='medium' />
        </span>
      </div>
    </div>
  </div>
  </div>
  );
};
