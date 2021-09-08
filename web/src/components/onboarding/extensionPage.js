import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { isExtensionInstalled } from '../../utils/extension';
import styles from './onboarding.module.scss';

const EXTENSION_LINK = process.env.NEXT_PUBLIC_EXTENSION_LINK;

const ExtensionPage = ({ page, previousPage, closeModal, onSubmit }) => {
  const [isPluginInstalled, togglePluginInstalled] = useState(false);
  const [isQueryFinished, setQueryFinished] = useState(false);

  const renderExtensionState = () => {
    if (!isQueryFinished) {
      return (
        <>
          <div className="has-text-centered mt-90">
            <img src="/img/logo_loader.gif" alt="loader" />
          </div>
          <div className="has-text-centered mt-20 mb-70">
            Searching for the Extension
          </div>
        </>
      );
    }
    if (!isPluginInstalled) {
      return (
        <>
          <div className="has-text-centered mt-70">
            <img src="/img/chrome_extension.png" alt="Chrome Extension" className="has-text-centered" />
          </div>
          <div className="has-text-centered">
            <button
              type="button"
              className="button is-text has-text-primary my-20"
              onClick={() => window.open(EXTENSION_LINK, '_blank')}
            >
              Install the extension
            </button>
          </div>
        </>
      );
    }
    return (
      <>
        <div className="has-text-centered mt-90">
          <FontAwesomeIcon icon={faCheckCircle} className="has-text-success" style={{ fontSize: '50px' }} />
        </div>
        <div className="has-text-centered has-text-success mt-20 mb-70">
          Extension Found!
        </div>
      </>
    );
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isPluginInstalled) {
        clearInterval(interval);
      }
      const res = await isExtensionInstalled();
      togglePluginInstalled(res);
      setQueryFinished(true);
    }, 5000);
  }, []);

  return (
    <>
      <div className="columns m-0 is-full-height" style={{}}>
        <div className="is-flex is-justify-content-space-between is-align-items-center p-15 is-hidden-desktop">
          <p className="has-text-primary has-text-weight-semibold is-size-4 p-5">One last step</p>
          <button type="button" className="button is-white" onClick={closeModal}>
            <FontAwesomeIcon className="is-clickable" icon={faTimes} size="lg" />
          </button>
        </div>
        <div className={clsx('column is-flex is-justify-content-center is-6 p-25', styles['animation-container'])}>
          <div className={clsx('is-flex is-justify-content-center is-align-items-center py-30')}>
            <img alt="" src="/img/install-extension.png" />
          </div>
        </div>
        <div className="column is-6 p-20 px-40 is-relative is-flex is-flex-direction-column is-justify-content-space-between">
          <div className="is-flex is-justify-content-space-between is-align-items-center">
            <p className="has-text-primary has-text-weight-semibold is-size-5 p-5">One last step</p>
            <button type="button" className="button is-white" onClick={closeModal}>
              <FontAwesomeIcon className="is-clickable" icon={faTimes} />
            </button>
          </div>
          <div className={styles.info}>
            <p className="has-text-deep-black is-size-7 mb-5">One last step</p>
            <p className={clsx('mb-20 is-size-4 has-text-weight-semibold has-text-deep-black')}>Install the Sema Extension!</p>
            <p className={clsx('mt-20')}>
              The Sema Feedback Panel is part of the Sema Chrome Extension. Please install it to continue.
            </p>
            <a href={EXTENSION_LINK} target="_blank" rel="noreferrer">
              <img src="/img/chrome_ext_button.png" alt="install" className={clsx('mt-20', styles['chrome-button'])} />
            </a>
          </div>
          <div className={clsx('is-flex is-justify-content-space-between is-align-items-center mb-10', styles.footer)}>
            {
              page !== 1 ? (
                <button
                  type="button"
                  className={clsx('button is-primary is-outlined')}
                  onClick={previousPage}
                >
                  <FontAwesomeIcon icon={faArrowLeft} color="primary" size="lg" />
                </button>
              ) : <div className={styles.space} />
            }
            <ul className={styles.ul}>
              <li className={page === 1 ? styles.active : null} />
              <li className={page === 2 ? styles.active : null} />
              <li className={page === 3 ? styles.active : null} />
              <li className={page === 4 ? styles.active : null} />
            </ul>
            <button
              type="button"
              className={clsx('button is-primary')}
              onClick={async () => {
                await onSubmit();
                closeModal();
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

ExtensionPage.propTypes = {
  page: PropTypes.number.isRequired,
  previousPage: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ExtensionPage;
