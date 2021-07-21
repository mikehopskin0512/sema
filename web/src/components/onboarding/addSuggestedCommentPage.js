import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { commentCollection } from './content';

const AddSuggestedCommentPage = ({ page, nextPage, previousPage }) => {

  return (
    <>
      <div className="m-20">
        <p className="title is-4">Create your first custom suggested comment</p>
        <p className="subtitle is-6">Have a code review comment you frequently reuse? Add it here and it will be ready for your next review. <strong>Fill out at least one of these fields and we'll do the rest.</strong></p>
        
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
          onClick={nextPage}
        >
          Skip this step
        </button>
      </div>
    </>
  )
}

export default AddSuggestedCommentPage
