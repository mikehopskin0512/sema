import InteractionCircleChart from '../../../components/chart/InteractionCircleChart';
import React, { useEffect, useMemo, useState } from 'react';
import { getRepoSocialGraph } from '../../../state/features/repositories/api';
import styles from './styles.module.scss';
import { useRouter } from 'next/router';
import Loader from '../../../components/Loader';
import { PATHS } from '../../../utils/constants';

const CollaborationPublicPage = () => {
  const { query, push } = useRouter();
  const [interactions, setInteractions] = useState([]);
  const {
    handle,
    repoId,
  } = query;
  const [repoName, setRepoName] = useState('');
  const [user, setUser] = useState('');

  // TODO: should be extracted to a hook or a component
  useEffect(() => {
    getRepoSocialGraph({handle, repoId})
      .then((res) => {
        setInteractions(res?.data?.interactionsByUsers);
        setRepoName(res?.data?.repoName);
        setUser(res?.data?.user);
      });
  }, [repoId])

  const onStartButtonClick = async () => {
    await push(`${PATHS.LOGIN}?isFastForwardOnboarding=true`)
  };

  return (
    <div className={styles['collaboration-page-wrapper']}>
      <div className={styles['collaboration-page-header']}>
        <p className={styles['collaboration-page-title']}>
          {handle}'s Repo Colleagues for {repoName}
        </p>
        <img className={styles['collaboration-page-logo']} alt='Sema logo' src='/img/logo-full.png' />
      </div>
      <div className={styles['collaboration-page-logo-content']}>
        <div style={{width: '100%', height: '800px'}}>
          {!interactions.length ? (
            <div className='is-flex is-align-items-center is-justify-content-center' style={{ height: '50vh' }}>
              <Loader customText='Loading' />
            </div>
          ) : (
            <InteractionCircleChart interactions={interactions} user={user} />
          )}
        </div>
        <span className={styles['collaboration-page-title']}>Let’s create your GitHub Social Circle.</span>
        <button className='button is-primary my-25' onClick={onStartButtonClick}>Get Started!</button>
      </div>
    </div>
  );
};

export default CollaborationPublicPage;
