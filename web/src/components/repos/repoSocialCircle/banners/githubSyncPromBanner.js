import React, { useEffect } from 'react';
import styles from './banners.module.scss';
import clsx from 'clsx';
import { CloseIcon } from '../../../Icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSyncPromoBanner } from '../../../../state/features/auth/actions';
import { useRouter } from 'next/router';
import { PATHS } from '../../../../utils/constants';
import { isEmpty } from 'lodash';

export const GithubSyncPromBanner = () => {
  const { pathname } = useRouter();
  const { isSyncBannerPromo, selectedOrganization } = useSelector(state => state.authState);
  const dispatch = useDispatch();

  const isShown = pathname.includes(PATHS.DASHBOARD) ||
    (pathname.includes(PATHS.ORGANIZATIONS._) && pathname.includes(PATHS.DASHBOARD)) ||
    (pathname.includes(PATHS.ORGANIZATIONS._) && pathname.includes(PATHS.REPOS)) ||
    (pathname.includes(PATHS.ORGANIZATIONS._) && pathname.includes(PATHS.ORGANIZATION_INSIGHTS)) ||
    (pathname.includes(PATHS.SNIPPETS._) && !pathname.includes('/add') && !pathname.includes('/edit') && !isEmpty(selectedOrganization));

  useEffect(() => {
    if (!localStorage.getItem('is-sync-banner')) {
      dispatch(toggleSyncPromoBanner(true));
    } else {
      dispatch(toggleSyncPromoBanner(false))
    }
  }, [])


  if (!isSyncBannerPromo || !isShown) return null;

  return (
    <div className={styles['promo-banner-wrapper']}>
      <div className={clsx('is-flex is-align-items-center', styles['promo-banner-section'])}>
        <p className={styles['promo-banner-text']}>GitHub Sync is coming — learn more about how this will take your repos to the next level!</p>
        <img src='/img/sync/sync-promo.png' alt='Sync promo image' className={styles['promo-banner-img']} />
      </div>
      <div className={clsx('is-flex is-align-items-center', styles['promo-banner-button-section'])}>
        <button className='button is-inverted is-outlined is-bold' onClick={() => {
          window.open('https://app.intercom.com/a/apps/bkmx8nl7/articles/articles/6344622/show', '__blank');
        }}>Learn More</button>
        <span className='icon is-clickable has-text-dark' onClick={() => {
          dispatch(toggleSyncPromoBanner(false));
          localStorage.setItem('is-sync-banner', 'true');
        }}>
          <CloseIcon size='medium' />
        </span>
      </div>
    </div>
  );
};
