import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const SmartBankCommentsPage = ({
  page, nextPage, previousPage, collectionState, toggleCollection, semaCollections,
}) => {
  return (
    <>
      <div className="m-20">
        <p className="title is-4">Please choose some comment collections</p>
        <p className="subtitle is-6">You can now activate groups of comments that suit your style and work environment. Choose the ones you want, or add your own to My Comments.</p>
        {
          semaCollections.map((collection, i) => {
            return (
              <React.Fragment key={`collection-${i + 1}`}>
                <div className="columns">
                  <div className="column is-11 pb-0">
                    <div className="title is-6">{collection.name}</div>
                    <div className="subtitle is-6">{collection.description}</div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <input
                        id={`switch-${i}`}
                        type="checkbox"
                        name={`switch-${i}`}
                        className="switch is-rounded"
                        checked={collectionState[collection._id]}
                        onChange={() => toggleCollection(collection._id)}
                      />
                      <label htmlFor={`switch-${i}`} />
                    </div>
                  </div>
                </div>
                <div className="is-divider my-20" />
              </React.Fragment>
            );
          })
        }
        <div className="columns">
          <div className="column is-11 pb-0">
            <div className="title is-6">My Comments</div>
            <div className="subtitle is-6">Have a code review comment you frequently reuse? Add it here and it will be ready for your next review.</div>
          </div>
          <div className="column">
            <div className="field">
              <input
                id={`switch-personal`}
                type="checkbox"
                name={`switch-personal`}
                className="switch is-rounded"
                checked={collectionState['personalComments']}
                onChange={() => toggleCollection('personalComments')}
              />
              <label htmlFor={`switch-personal`} />
            </div>
          </div>
        </div>
        <div className="is-divider my-20" />
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
          type="button"
          className="button is-primary my-20 is-pulled-right"
          onClick={nextPage}
        >
          Next
        </button>
        {/* <button
          type="button"
          className="button is-text has-text-primary my-20 is-pulled-right"
          onClick={nextPage}
        >
          Skip this step
        </button> */}
      </div>
    </>
  );
};

SmartBankCommentsPage.propTypes = {
  page: PropTypes.number.isRequired,
  nextPage: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
  collectionState: PropTypes.object.isRequired,
  toggleCollection: PropTypes.func.isRequired,
  semaCollections: PropTypes.array.isRequired,
};

export default SmartBankCommentsPage;
