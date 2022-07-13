import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import AddSuggestedCommentPage from './addSuggestedCommentPage';
import SmartBankCommentsPage from './smartBankCommentsPage';
import ContentPage from './contentPage';
import ExtensionPage from './extensionPage';
import styles from './onboarding.module.scss';

const OnboardingModal = ({
  isModalActive,
  page,
  nextPage,
  previousPage,
  collectionState,
  setCollection,
  toggleCollection,
  handleCommentFields,
  comment,
  toggleModalActive,
  semaCollections,
  setComment,
  onSubmit,
  isPluginInstalled,
}) => {
  const [isQueryFinished, setQueryFinished] = useState(false);

  const renderModalContent = (currentPage) => {
    switch (currentPage) {
      case 1:
      case 2:
      case 3:
      case 4:
        return (
          <ContentPage
            page={page}
            nextPage={() => nextPage(currentPage)}
            previousPage={() => previousPage(currentPage)}
            isPluginInstalled={isPluginInstalled}
            closeModal={() => toggleModalActive(false)}
          />
        );
      default:
        return '';
    }
  };

  useEffect(() => {
    const collection = { ...collectionState };
    for (const [key, value] of Object.entries(semaCollections)) {
      const field = value._id;
      collection[field] = true;
    }
    setCollection(collection);
  }, [semaCollections]);

  // Interval for delay of spinner in Extension Page
  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     if (isPluginInstalled) {
  //       clearInterval(interval);
  //     }
  //     const res = await isExtensionInstalled();
  //     togglePluginInstalled(res);
  //     setQueryFinished(true);
  //   }, 5000);
  // }, []);

  return (
    <div className={clsx('modal', isModalActive && 'is-active')}>
      <div className="modal-background"></div>
      <div className={clsx('modal-card', styles['modal'])}>
        {/* <header className="modal-card-head has-background-white">
            <p className="modal-card-title"></p>
            <button
              type="button"
              className="delete"
              aria-label="close"
              onClick={() => toggleModalActive(false)}
            />
          </header> */}
        <section className={clsx('modal-card-body p-0', styles['modal-body'])}>
          {renderModalContent(page)}
        </section>
        {/* <footer className="modal-card-foot">
            <button className="button is-success">Save changes</button>
            <button className="button">Cancel</button>
          </footer> */}
      </div>
    </div>
  );
};

OnboardingModal.propTypes = {
  isModalActive: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  nextPage: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
  collectionState: PropTypes.object.isRequired,
  setCollection: PropTypes.func.isRequired,
  toggleCollection: PropTypes.func.isRequired,
  handleCommentFields: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  toggleModalActive: PropTypes.func.isRequired,
  semaCollections: PropTypes.array.isRequired,
  setComment: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isPluginInstalled: PropTypes.bool.isRequired,
};

export default OnboardingModal;
