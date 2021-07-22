import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './onboarding.module.scss';
import withLayout from '../../components/layout';
import ContentPage from '../../components/onboarding/contentPage';
import SmartBankCommentsPage from '../../components/onboarding/smartBankCommentsPage';
import AddSuggestedCommentPage from '../../components/onboarding/addSuggestedCommentPage';
import { commentCollection } from '../../components/onboarding/content';
import ExtensionPage from '../../components/onboarding/extensionPage';

const Onboarding = () => {
  const [collectionState, setCollection] = useState({});
  const [isModalActive, toggleModalActive] = useState(true);
  const [page, setPage] = useState(1);
  const [comment, setComment] = useState({});

  const nextPage = (currentPage) => {
    setPage(currentPage + 1);
  };

  const previousPage = (currentPage) => {
    setPage(currentPage - 1);
  };

  const toggleCollection = (field) => {
    const newCollection = { ...collectionState };
    newCollection[field] = !newCollection[field];
    setCollection(newCollection);
  };

  const handleCommentFields = (e) => {
    setComment({ ...comment, [e.target.name]: e.target.value });
  };

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
    <div className={clsx(styles['onboarding-container'])}>
      <div className="columns my-120">
        <div className="column is-4" />
        <div className="column is-4">
          <div className="is-size-3 py-50">Please enter your information</div>
          <div className="tile">
            <div className="tile is-child">
              <div className="field">
                <label className="label">First name</label>
                <div className="control">
                  <input
                    className={`input`}
                    type="text"
                    placeholder="Tony"
                  />
                </div>

              </div>
              <div className="field">
                <label className="label">Last name</label>
                <div className="control">
                  <input
                    className={`input`}
                    type="text"
                    placeholder="Tony"
                  />
                </div>

              </div>
              <button
                type="button"
                className="button is-primary is-full-width my-20"
                onClick={() => toggleModalActive(true)}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
        <div className="column is-4" />
      </div>
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
    </div>
  )
};

export default withLayout(Onboarding);
