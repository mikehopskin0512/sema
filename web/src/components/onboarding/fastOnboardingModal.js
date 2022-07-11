import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import styles from './onboarding.module.scss';
import { CloseIcon } from '../../components/Icons';
import { black900 } from '../../../styles/_colors.module.scss';
import useOutsideClick from '../../utils/useOutsideClick';

// TODO: replace it with real repoData properties from synced info
const RepoListItem = ({
  repoData,
  isSynced,
}) => {
  return (
    <div className={styles["repo-list-item-wrapper"]}>
      <img className={styles["repo-list-item-img"]} alt="temporary_alt" src="/img/onboarding/repo-item-ph.png" />
      <p className={styles["repo-list-item-name"]}>repo_1 Name</p>
      <button className={styles["repo-list-item-button"]}>{isSynced ? 'Synced' : 'Ready for sync'}</button>
    </div>
  )
}

const FFOnboardingModal = ({
  isModalActive,
  onClose
}) => {
  const modalRef = useRef();

  useOutsideClick(modalRef, onClose);

  useEffect(() => {
    // TODO: fetch user repos
    //  Also I think we need a separated reducer for synced repos... Or, I don't know
  }, [])

  return (
    <div className={clsx('modal', isModalActive && 'is-active')}>
      <div className="modal-background" />
      <div className={clsx('modal-card', styles['ffo-modal-wrapper'])} ref={modalRef}>
        <section className={clsx('modal-card-body p-0', styles['modal-body'])}>
          <div onClick={onClose} className="is-clickable" style={{
            position: "absolute",
            top: 20,
            right: 30,
          }}>
            <CloseIcon size="medium" color={black900} />
          </div>
          <div className="is-flex is-full-height">
            <div className={styles['ffo-modal-image-section']}/>
            <div className={styles['ffo-modal-repos-list-section']}>
              <p className={styles['ffo-modal-repos-list-section-title']}>Choose your most often used repos:</p>
              <p className={styles['ffo-modal-repos-list-section-text']}>This will help us to organize your repos, <br /> collegues, and pull requests.</p>

              <div className={styles['ffo-modal-repos-list']}>
                {new Array(40).fill('').map((_) => <RepoListItem repoData={_} isSynced />)}
              </div>
            </div>
            <button
              type="button"
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

export default FFOnboardingModal
