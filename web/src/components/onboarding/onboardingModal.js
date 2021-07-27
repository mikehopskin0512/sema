import React, { useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import AddSuggestedCommentPage from './addSuggestedCommentPage';
import SmartBankCommentsPage from './smartBankCommentsPage';
import ContentPage from './contentPage';
import ExtensionPage from './extensionPage';
import styles from './onboarding.module.scss';
import { commentCollection } from './content';

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
}) => {
  const renderModalContent = (currentPage) => {
    switch (currentPage) {
    case 1:
    case 2:
    case 3:
      return <ContentPage page={page} nextPage={() => nextPage(currentPage)} previousPage={() => previousPage(currentPage)} />;
    case 4:
      return (
        <SmartBankCommentsPage
          page={page}
          nextPage={() => nextPage(currentPage)}
          previousPage={() => previousPage(currentPage)}
          collectionState={collectionState}
          toggleCollection={toggleCollection}
        />
      );
    case 5:
      return (
        <AddSuggestedCommentPage
          page={page}
          nextPage={() => nextPage(currentPage)}
          previousPage={() => previousPage(currentPage)}
          comment={comment}
          handleCommentFields={(e) => handleCommentFields(e)}
        />
      );
    case 6:
      return (
        <ExtensionPage
          page={page}
          nextPage={() => nextPage(currentPage)}
          previousPage={() => previousPage(currentPage)}
          closeModal={() => toggleModalActive(false)}
        />
      );
    default:
      return '';
    }
  };

  useEffect(() => {
    const collection = {};
    for (const [key, value] of Object.entries(commentCollection)) {
      const field = value.field;
      collection[field] = true;
    }
    setCollection(collection);
  }, []);

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
        <section className={clsx('modal-card-body')}>
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
  comment: PropTypes.string.isRequired,
  toggleModalActive: PropTypes.func.isRequired,
};

export default OnboardingModal;
