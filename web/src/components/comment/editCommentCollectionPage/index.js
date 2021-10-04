import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import EditCommentCollectionForm from '../editCommentCollectionForm';

const EditCommentCollectionPage = ({ token }) => {
  return(
    <>
      <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center is-flex-wrap-wrap">
        <div className="is-flex is-flex-wrap-wrap is-align-items-center">
          <p className="has-text-weight-semibold has-text-deep-black is-size-4 mr-10">
            Add a Comment Collection
          </p>
        </div>
        <div className="is-flex">
          <button
            className="button is-small is-outlined is-primary border-radius-4px mr-10"
            type="button"
          >
            Cancel
          </button>
          <button
            className="button is-small is-primary border-radius-4px"
            type="button"
          >
            <FontAwesomeIcon icon={faCheck} className="mr-10" />
            Save
          </button>
        </div>
      </div>
      <EditCommentCollectionForm token={token} />
    </>
  )
}

export default EditCommentCollectionPage;