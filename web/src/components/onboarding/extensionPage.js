import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { isExtensionInstalled } from '../../utils/extension';
import styles from './onboarding.module.scss';
import { authOperations } from '../../state/features/auth';

const { trackOnboardingCompleted } = authOperations;

const EXTENSION_LINK = process.env.NEXT_PUBLIC_EXTENSION_LINK;

const ExtensionPage = ({ page, previousPage, isPluginInstalled, closeModal }) => {
  // const [isQueryFinished, setQueryFinished] = useState(false);

  const renderExtensionState = () => {
    // Spinner
    // if (!isQueryFinished) {
    //   return (
    //     <div className="is-flex is-align-item-center mt-25">
    //       <img src="/img/onboarding/logo_loader.gif" alt="loader" className={clsx("mr-10", styles.loader)} />
    //       <p>Searching for the Extension...</p>
    //     </div>
    //   );
    // }

    if (!isPluginInstalled) {
      return (
        <>
          <button
            type="button"
            className="button is-primary has-text-weight-semibold mt-25"
            onClick={() => window.open(EXTENSION_LINK, '_blank')}
          >
            <img src="/img/onboarding/google-extension.png" alt="install" className={clsx('mr-10', styles['chrome-button'])} />
            Add Extension Here
          </button>
        </>
      );
    }
    return (
      <div className="is-flex is-align-items-center mt-25">
        <FontAwesomeIcon icon={faCheckCircle} className="has-text-primary mr-10" size="lg" />
        <p>Extension Added</p>
      </div>
    );
  };

  const handleOnClick = () => {
    trackOnboardingCompleted();
    closeModal();
  };

  return (
    <>
      <div className="columns m-0 is-full-height" style={{}}>
        <div className="is-flex is-justify-content-space-between is-align-items-center p-15 is-hidden-desktop">
          <p className="has-text-primary has-text-weight-semibold is-size-4 p-5">One last step</p>
          <button type="button" className="button is-white" onClick={handleOnClick}>
            <FontAwesomeIcon className="is-clickable" icon={faTimes} size="lg" />
          </button>
        </div>
        <div className={clsx('column is-flex is-justify-content-center is-6 p-25', styles['animation-container'])}>
          <div className={clsx('is-flex is-justify-content-center is-align-items-center py-30')}>
            <img alt="" src="/img/onboarding/install-extension.png" />
          </div>
        </div>
        <div className="column is-6 p-20 px-40 is-relative is-flex is-flex-direction-column is-justify-content-space-between">
          <div className="is-flex is-justify-content-space-between is-align-items-center">
            <p className="has-text-primary has-text-weight-semibold is-size-5 p-5">One last step</p>
            <button type="button" className="button is-white" onClick={handleOnClick}>
              <FontAwesomeIcon className="is-clickable" icon={faTimes} />
            </button>
          </div>
          <div className={styles.info}>
            <p className="has-text-black-950 is-size-7 mb-5">One last step</p>
            <p className={clsx('mb-20 is-size-4 has-text-weight-semibold has-text-black-950')}>Add the Sema Extension!</p>
            <p className={clsx('mt-20')}>
              The Sema Feedback Panel is part of the Sema Chrome Extension. Please install it to continue.
            </p>
            {renderExtensionState()}
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
              className={clsx('button is-primary is-outlined')}
              onClick={handleOnClick}
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
};

export default ExtensionPage;
