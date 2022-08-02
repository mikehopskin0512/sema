import InteractionCircleChart from '../../../components/chart/InteractionCircleChart';
import React, { useEffect, useMemo, useState } from 'react';
import { getRepoSocialGraph } from '../../../state/features/repositories/api';
import styles from './styles.module.scss';
import { useRouter } from 'next/router';
import Loader from '../../../components/Loader';
import { PATHS, SEMA_FAQ_SLUGS, SEMA_INTERCOM_URL, SEMA_MAIN_URL } from '../../../utils/constants';
import useResizeObserver from 'use-resize-observer';
import clsx from 'clsx';
import Footer from '../../../components/footer';

const CollaborationPublicPage = () => {
  const {
    query,
    push,
  } = useRouter();
  const [interactions, setInteractions] = useState([]);
  const { ref: graphWrapperRef, width, height } = useResizeObserver();
  const {
    handle,
    repoId,
  } = query;
  const [repoName, setRepoName] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    getRepoSocialGraph({
      handle,
      repoId,
    })
      .then((res) => {
        setInteractions(res?.data?.interactionsByUsers);
        setRepoName(res?.data?.repoName);
        setUser(res?.data?.user);
      });
  }, [repoId]);

  const onStartButtonClick = async () => {
    await push(`${PATHS.LOGIN}?isFastForwardOnboarding=true`);
  };

  return (<div className={styles['wrapper']}>
  <img alt="Sunset" src="/img/Sunset2.png" className={styles['absolute-image']}/>
  <div className={styles['collaboration-page-content']}>
    <div className={styles['collaboration-page-wrapper']}>
      <div className={styles['collaboration-page-header']}>
        <p className={styles['collaboration-page-title']}>
          {handle}'s Repo Colleagues for {repoName}
        </p>
        <a href={SEMA_MAIN_URL} target="_blank" rel="noreferrer">
          <img className={styles['collaboration-page-logo']} alt='Sema logo' src='/img/logo-full-bright.png' />
        </a>
      </div>
      <div className={styles['collaboration-page-logo-content']}>
        <div className={styles['interactions-graph-wrapper']} ref={graphWrapperRef}>
          {!interactions.length ? (
            <div className='is-flex is-align-items-center is-justify-content-center' style={{ height: '50vh' }}>
              <Loader customText='Loading' />
            </div>
          ) : (
            <InteractionCircleChart interactions={interactions} user={user} />
          )}
        </div>
      </div>
    </div>
    <div className={styles['collaboration-bottom-control']}>
      <div className={styles['collaboration-control-left-block']}>
        <div>
          <img style={{ width: '104px', height: '104px' }} alt='Happy' src='/img/happy.png' />
        </div>
        <p className="has-text-white-0" style={{maxWidth: '65%'}}>
          Larger, closer circles are your tight-knit team, who you worked with the most over the last year. Smaller, distant circles are team members you don’t spend as much time working with.
        </p>
      </div>
      <div className={styles['collaboration-control-block']} style={{zIndex: 10}}>
        <span className={clsx(styles['collaboration-page-title'], styles['collaboration-page-title-centered'])}>Create your own GitHub Social Circle</span>
        <div className="is-flex is-justify-content-left is-full-width is-flex-wrap-wrap" style={{paddingLeft: '5%'}}>
          <button className={styles['collaboration-primary-button']} onClick={onStartButtonClick}>Get Started!</button>
          <a target="_blank" href={`${SEMA_INTERCOM_URL}${SEMA_FAQ_SLUGS.LEARN_MORE_ABOUT_SOCIAL_CIRCLES}`} className={styles['collaboration-side-button']}>Learn more</a>
        </div>
      </div>
    </div>
    </div>
    <Footer />
    </div>
  );
};

export default CollaborationPublicPage;
