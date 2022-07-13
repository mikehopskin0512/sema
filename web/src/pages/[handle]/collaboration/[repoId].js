import React, { useEffect, useMemo } from 'react';
import styles from './styles.module.scss';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../components/Loader';
import { PATHS } from '../../../utils/constants';
import { fetchRepo } from '../../../state/features/repositories/actions';

const CollaborationPublicPage = () => {
  const { query, push } = useRouter();
  const dispatch = useDispatch();
  const {
    data: repositoriesStateData,
    isFetching,
  } = useSelector((state) => state.repositoriesState);
  const {
    handle,
    repoId,
    repo,
  } = query;

  const onStartButtonClick = async () => {
    await push(`${PATHS.LOGIN}?isFastForwardOnboarding=true`)
  };

  const title = useMemo(() => `${handle}'s Repo Colleagues for ${repo}`, [query]);

  return (
    <div className={styles['collaboration-page-wrapper']}>
      {isFetching && (
        <div className='is-flex is-align-items-center is-justify-content-center' style={{ height: '50vh' }}>
          <Loader customText='Loading...' />
        </div>
      )}

      {!isFetching && (
        <>
          <div className={styles['collaboration-page-header']}>
            <p className={styles['collaboration-page-title']}>{title}</p>
            <img className={styles['collaboration-page-logo']} alt='Sema logo' src='/img/logo-full.png' />
          </div>
          <div className={styles['collaboration-page-logo-content']}>
            <div className={styles['collaboration-page-fake-graph']} />
            <span className={styles['collaboration-page-title']}>Let’s create your GitHub Social Circle.</span>
            <button className='button is-primary my-25' onClick={onStartButtonClick}>Get Started!</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CollaborationPublicPage;
