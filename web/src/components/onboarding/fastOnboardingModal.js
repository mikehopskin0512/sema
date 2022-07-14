import React, { useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';
import styles from './onboarding.module.scss';
import { CloseIcon } from '../../components/Icons';
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
  isSynced,
  onModalClose,
}) => {
  const router = useRouter();
  const onItemClick = () => {
    router.push(`${PATHS.REPO}/${repoData?.externalId}`);
    onModalClose();
  };
  return (
    <div className={styles['repo-list-item-wrapper']} onClick={onItemClick}>
      {/* TODO: ask to add images into repo-sync data fetching */}
      <img className={styles['repo-list-item-img']} alt='temporary_alt' src='/img/onboarding/repo-item-ph.png' />
      <p className={styles['repo-list-item-name']}>{capitalize(repoData.name)}</p>
      <button className={styles['repo-list-item-button']}>{isSynced ? 'Synced' : 'Ready for sync'}</button>
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
        title: 'Choose your most often used repos:',
        text: 'This will help us to organize your repos, collegues, and pull requests.',
      } :
      {
        title: 'It looks like you don\'t have any public repos',
        text: 'For now, Sema can only import and visualize public repo data. We\'re currently working on expanding to private repos, stay tuned!',
      };
  }, [repositories]);

  return (
    <div className={clsx('modal', isModalActive && 'is-active')}>
      <div className='modal-background' />
      <div className={clsx('modal-card', styles['ffo-modal-wrapper'])} ref={modalRef}>
        <section className={clsx('modal-card-body p-0', styles['modal-body'])}>
          <div onClick={onClose} className='is-clickable' style={{
            position: 'absolute',
            top: 20,
            right: 30,
          }}>
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
                    ?.map((data) => <RepoListItem repoData={data} isSynced onModalClose={onClose} />)}
                </div>
              </div>
            )}
            <button
              type='button'
              className={clsx('button is-outlined is-primary has-background-white has-text-primary border-radius-4px', styles['ffo-modal-repos-list-section-button'])}
              onClick={onClose}>
              Complete
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FFOnboardingModal;
