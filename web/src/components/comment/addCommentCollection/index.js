import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import EditSuggestedCommentForm from '../editSuggestedCommentForm';
import { suggestCommentsOperations } from '../../../state/features/suggest-comments';
import { commentsOperations } from '../../../state/features/comments';
import { makeTagsList } from '../../../utils';

const { bulkCreateSuggestedComments } = suggestCommentsOperations;
const { getCollectionById } = commentsOperations;

const initialValues = {
  title: '',
  source: {
    name: '',
    url: '',
  },
  tags: [],
  comment: '',
};

const AddCommentCollection = (props) => {
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
      <div className="p-10">
        <div className="mb-25">
          <label className="label has-text-deep-black">Collection Title *</label>
          <input
            className="input has-background-white"
            type="text"
          />
        </div>
        <div className="mb-25">
          <label className="label has-text-deep-black">Tags/Language/Framework/Version *</label>
          <input
            className="input has-background-white"
            type="text"
          />
          <p className="is-size-7 is-italic">These tags automatically add to new Comment in this Collection</p>
        </div>
        <div className="mb-25">
          <label className="label has-text-deep-black">Collection Title *</label>
          <textarea className="textarea has-background-white"></textarea>
        </div>
      </div>
    </>
  )
}

export default AddCommentCollection;