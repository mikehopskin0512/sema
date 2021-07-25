import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { commentCollection } from './content';

const AddSuggestedCommentPage = ({ page, nextPage, previousPage, comment, handleCommentFields, setComment }) => {
  return (
    <>
      <div className="m-20">
        <p className="title is-4">Create your first custom suggested comment</p>
        <p className="subtitle is-6">Have a code review comment you frequently reuse? Add it here and it will be ready for your next review. <strong>Fill out at least one of these fields and we'll do the rest.</strong></p>
        <div className="mb-50">
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className={`input`}
                type="text"
                name="title"
                value={comment?.title}
                onChange={(e) => handleCommentFields(e)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Comment</label>
            <div className="control">
              <textarea
                className="textarea"
                placeholder="Add 1-4 sentences for a comment you would like to reuse"
                name="comment"
                value={comment?.comment}
                onChange={(e) => handleCommentFields(e)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Link for more reading</label>
            <div className="control">
              <input
                className={`input`}
                type="text"
                placeholder="www.example.com"
                name="source"
                value={comment?.source}
                onChange={(e) => handleCommentFields(e)}
              />
            </div>
          </div>
        </div>

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
        <button
          type="button"
          className="button is-text has-text-primary my-20 is-pulled-right"
          onClick={() => {
            nextPage()
            setComment({});
          }}
        >
          Skip this step
        </button>
      </div>
    </>
  );
};

AddSuggestedCommentPage.propTypes = {
  page: PropTypes.number.isRequired,
  nextPage: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
  setComment: PropTypes.func.isRequired,
};

export default AddSuggestedCommentPage;
