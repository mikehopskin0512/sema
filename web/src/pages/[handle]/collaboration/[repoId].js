import InteractionCircleChart from '../../../components/chart/InteractionCircleChart';
import React, { useEffect, useMemo, useState } from 'react';
import { getRepoSocialGraph } from '../../../state/features/repositories/api';
import styles from './styles.module.scss';
import { useRouter } from 'next/router';
import Loader from '../../../components/Loader';
import { PATHS } from '../../../utils/constants';
import useResizeObserver from 'use-resize-observer';
import clsx from 'clsx';

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

  const scaling = useMemo(() => {
    const commonWidthSize = 800;
    const commonHeightSize = 900;
    const minimalScaleValue = 0.3;
    const windowHeight = window.innerHeight;
    const isFitSize = width > commonWidthSize && windowHeight > commonHeightSize;

    if (isFitSize) return 1;
    const result = ((100 * width) / commonWidthSize).toFixed(2) / 100;
    const heightOffset = (1 - (((100 * windowHeight) / commonHeightSize).toFixed(2) / 100)) * 2;
    const calculatedScale =  (result > 1 ? 1 : result) - (heightOffset  > 0 ? heightOffset : 0) ;

    return calculatedScale > minimalScaleValue ? calculatedScale : minimalScaleValue;
  }, [graphWrapperRef, width, height])

  return (
    <div className={styles['collaboration-page-wrapper']}>
      <div className={styles['collaboration-page-header']}>
        <p className={styles['collaboration-page-title']}>
          {handle}'s Repo Colleagues for {repoName}
        </p>
        <img className={styles['collaboration-page-logo']} alt='Sema logo' src='/img/logo-full.png' />
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
        <div className={styles['collaboration-control-block']}>
          <span className={clsx(styles['collaboration-page-title'], styles['collaboration-page-title-centered'])}>Let’s create your GitHub Social Circle.</span>
          <button className='button is-primary my-25' onClick={onStartButtonClick}>Get Started!</button>
        </div>
      </div>
    </div>
  );
};

export default CollaborationPublicPage;
