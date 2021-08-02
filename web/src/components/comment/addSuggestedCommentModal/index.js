/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import SelectTags from '../selectTags';
import { commentsOperations } from '../../../state/features/comments';
import { suggestCommentsOperations } from '../../../state/features/suggest-comments';

const { getCollectionById } = commentsOperations;
const { createSuggestComment } = suggestCommentsOperations;

const AddSuggestedCommentModal = ({ active, onClose }) => {
  const dispatch = useDispatch();
  const {
    register, handleSubmit, reset, formState,
  } = useForm();

  const { auth, suggestedComment } = useSelector(
    (state) => ({
      auth: state.authState,
      suggestedComment: state.suggestCommentsState,
    }),
  );
  const {
    query: { collectionId },
  } = useRouter();

  const { token } = auth;
  const { isFetching } = suggestedComment;

  const [tags, setTags] = useState();
  const modalRef = useRef(null);

  const { errors } = formState;

  const onSubmit = async (data) => {
    await dispatch(createSuggestComment({
      ...data,
      tags,
      collectionId,
    }, token));
    reset();
    onClose();
    dispatch(getCollectionById(collectionId, token));
  };

  return (
    <div className={`modal ${active ? 'is-active' : ''}`} ref={modalRef}>
      <div className="modal-background" />
      <div className="modal-content px-10">
        <div className="p-50 has-background-white">
          <p className="has-text-black has-text-weight-bold is-size-4 mb-10">Create a Custom Suggested Comment</p>
          <p className="mb-20">
            Have a code review comment you frequently reuse? Add it here and it will be ready for your next review.
            <b> Fill out at least one of these fields and we&apos;ll do the rest.</b>
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="field mb-20">
              <label className="label is-size-7">Title</label>
              <div className="control">
                <input
                  className="input has-background-white is-size-7"
                  type="text"
                  {...register(
                    'title',
                    {
                      required: 'Title is required',
                    },
                  )}
                />
                <p className="help is-danger">{errors.title && errors.title.message}</p>
              </div>
            </div>
            <div className="field mb-20">
              <label className="label is-size-7">Message</label>
              <div className="control">
                <textarea
                  {...register(
                    'comment',
                    {
                      required: 'Message is required',
                    },
                  )}
                  className="textarea has-background-white is-size-7"
                  placeholder="Add 1-4 sentences for a comment you would like to reuse"
                />
                <p className="help is-danger">{errors.comment && errors.comment.message}</p>
              </div>
            </div>
            <div className="field mb-20">
              <label className="label is-size-7">Tags</label>
              <div className="control">
                <SelectTags modalRef={modalRef} setTags={setTags} />
              </div>
            </div>
            <div className="field mb-20">
              <label className="label is-size-7">Source</label>
              <div className="control">
                <input
                  {...register('source')}
                  className="input has-background-white is-size-7"
                  type="text" />
              </div>
            </div>
            <div className="is-flex is-justify-content-center">
              <button className="button has-text-weight-semibold is-size-7 mx-10" onClick={() => onClose()} type="button">Cancel</button>
              <button
                className={clsx('button is-primary has-text-weight-semibold is-size-7 mx-10', isFetching ? 'is-loading' : '')}
                type="submit"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

AddSuggestedCommentModal.propTypes = {
  active: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddSuggestedCommentModal;
