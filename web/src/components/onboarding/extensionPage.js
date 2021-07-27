import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { isExtensionInstalled } from '../../utils/extension';

const EXTENSION_LINK = process.env.NEXT_PUBLIC_EXTENSION_LINK;

const ExtensionPage = ({ page, nextPage, previousPage, closeModal }) => {
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
      <div className="mt-90">
        <p className="title is-4 has-text-centered">Install the Sema Extension</p>
        <p className="subtitle is-5 has-text-centered">It's easy</p>
        <p className="subtitle is-6 has-text-centered px-250">The Sema Feedback Panel is part of the Sema Chrome Extension. Please install it to continue.</p>
        {renderExtensionState()}
        {
          page !== 1 && (
            <button
              type="button"
              className="button is-primary my-20 is-outlined"
              onClick={previousPage}
            >
              <FontAwesomeIcon icon={faArrowLeft} color="primary" size="lg" />
            </button>
          )
        }
        <button
          type="submit"
          className="button is-primary my-20 is-pulled-right"
          // onClick={nextPage}
          disabled={!isPluginInstalled}
        >
          Done
        </button>
        <button
          type="submit"
          className="button is-text has-text-primary my-20 is-pulled-right"
          onClick={closeModal}
        >
          Skip for now
        </button>
      </div>
    </>
  );
};

ExtensionPage.propTypes = {
  page: PropTypes.number.isRequired,
  nextPage: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ExtensionPage;
