import React, { useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';
import styles from './onboarding.module.scss';
import { CloseIcon, GhRefreshIcon, GhSyncIcon } from '../../components/Icons';
import { black900 } from '../../../styles/_colors.module.scss';
import useOutsideClick from '../../utils/useOutsideClick';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { fetchRepoDashboard } from '../../state/features/repositories/actions';
import { capitalize } from 'lodash';
import { useRouter } from 'next/router';
import { PATHS } from '../../utils/constants';

const RepoListItem = ({
  repoData,
  onModalClose,
}) => {
  const router = useRouter();
  const onItemClick = () => {
    router.push(`${PATHS.REPO}/${repoData?.externalId}`);
    onModalClose();
  };

  const isSynced = repoData?.sync?.status === 'completed';

  return (
    <div className={styles['repo-list-item-wrapper']} onClick={onItemClick}>
      {/* TODO: ask to add images into repo-sync data fetching */}
      <img className={styles['repo-list-item-img']} alt='temporary_alt' src={`https://avatars.githubusercontent.com/${repoData.externalId}`} />
      <div className={styles['repo-list-item-name-wrapper']}>
        <p className={styles['repo-list-item-name']}>{capitalize(repoData.name)}</p>
      </div>
      <button className={styles['repo-list-item-button']}>
        {isSynced ? <GhSyncIcon size="small" /> : <GhRefreshIcon size="small" />}
        {isSynced ? 'Synced' : 'Syncing'}
      </button>
    </div>
  );
};

const FFOnboardingModal = ({
  isModalActive,
  onClose,
}) => {
  const modalRef = useRef();
  const dispatch = useDispatch();
  const {
    auth,
    repositories: {
      isFetching,
      data: reposData,
    },
  } = useSelector((state) => ({
    auth: state.authState,
    repositories: state.repositoriesState,
  }));
  const { repositories } = reposData;
  const {
    user,
    token,
  } = auth;
  const { identities } = user;
  const userRepos = identities?.length ? identities[0].repositories : [];

  useOutsideClick(modalRef, onClose);

  useEffect(() => {
    if (!isModalActive) return;
    if (!repositories.length && userRepos.length) {
      const externalIds = userRepos.map((repo) => repo.id);
      dispatch(fetchRepoDashboard({
        externalIds,
        query: '',
      }, token));
    }
  }, [repositories, isModalActive]);

  const correctModalTexts = useMemo(() => {
    return repositories.length ?
      {
        title: 'Create your GitHub Social Circle',
        text: (
          <span>Choose your most active repo to see who<br /> your closest collaborators are.</span>
        ),
      } :
      {
        title: 'Wait, it seems you don’t have a public repo.',
        text: (
          <>
            <span>For now, Sema can only work with public repo data. Don’t worry, we’re working on extending this to private repos too.</span>
            <br />
            <span className='mt-5'>
              In the meantime, you can use Sema to write more meaningful code reviews or create a Developer Portfolio. <br /> Enjoy!
            </span>
          </>
        ),
      };
  }, [repositories]);

  return (
    <div className={clsx('modal', isModalActive && 'is-active')}>
      <div className='modal-background' />
      <div className={clsx('modal-card', styles['ffo-modal-wrapper'])} ref={modalRef}>
        <section className={clsx('modal-card-body p-0', styles['modal-body'])}>
          <div onClick={onClose} className={clsx('is-clickable', styles['ffo-modal-close-icon'])}>
            <CloseIcon size='medium' color={black900} />
          </div>

          <div className='is-flex is-full-height'>
            <div className={styles['ffo-modal-image-section']} />
            {isFetching && (
              <div className='is-flex is-align-items-center is-justify-content-center mr-auto ml-auto' style={{ height: '50vh' }}>
                <Loader customText='Loading...' />
              </div>
            )}

            {!isFetching && (
              <div className={styles['ffo-modal-repos-list-section']}>
                <p className={styles['ffo-modal-repos-list-section-title']}>{correctModalTexts.title}</p>
                <p className={styles['ffo-modal-repos-list-section-text']}>
                  {correctModalTexts.text}
                </p>
                <div className={styles['ffo-modal-repos-list']}>
                  {repositories?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    ?.map((data, index) => <RepoListItem repoData={data} onModalClose={onClose} key={index} />)}
                </div>
              </div>
            )}
            {Boolean(repositories.length) && (
              <p className={styles['ffo-modal-missing-repos-block']}>
                Missing a repo? Only public repos can be synced with Sema <br /> for now. Private repo sync is coming soon!
              </p>
            )}
            {!Boolean(repositories.length) && (
              <button
                type='button'
                className={clsx('button is-outlined is-primary has-background-white has-text-primary border-radius-4px', styles['ffo-modal-repos-list-section-button'])}
                onClick={onClose}>
                Complete
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FFOnboardingModal;
