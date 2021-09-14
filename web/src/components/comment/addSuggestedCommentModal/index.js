import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import CreatableSelect from 'react-select/creatable';

import { commentsOperations } from '../../../state/features/comments';
import { suggestCommentsOperations } from '../../../state/features/suggest-comments';
import { tagsOperations } from '../../../state/features/tags';
import { tagsState } from '../../../state/features';

const { fetchTagList } = tagsOperations;

const { getCollectionById } = commentsOperations;
const { createSuggestComment, updateSuggestComment } = suggestCommentsOperations;

const AddSuggestedCommentModal = ({ active, onClose, _id, comment }) => {
  const dispatch = useDispatch();
  const {
    register, handleSubmit, reset, formState, setValue,
  } = useForm();

  const { auth, suggestedComment, tagState } = useSelector(
    (state) => ({
      auth: state.authState,
      suggestedComment: state.suggestCommentsState,
      tagState: state.tagsState,
    }),
  );
  const {
    query: { collectionId = _id },
  } = useRouter();

  const { token, user } = auth;
  const { isFetching } = suggestedComment;

  const [tags, setTags] = useState();
  const modalRef = useRef(null);

  const { errors } = formState;

  const [tagOptions, setTagOptions] = useState([]);

  useEffect(() => {
    dispatch(fetchTagList(token));
  }, [dispatch, token]);

  useEffect(() => {
    const guides = [];
    const languages = [];
    const custom = [];
    tagState.tags.forEach((item) => {
      const { type, _id, label } = item;
      if (type === 'guide') {
        guides.push({
          label,
          value: _id,
        });
      }
      if (type === 'language') {
        languages.push({
          label,
          value: _id,
        });
      }
      if (type === 'custom') {
        custom.push({
          label,
          value: _id,
        });
      }
    });
    setTagOptions([
      {
        label: 'Guides',
        options: guides,
      },
      {
        label: 'Languages',
        options: languages,
      },
      {
        label: 'Custom',
        options: custom,
      },
    ]);
  }, [tagState.tags]);

  useEffect(() => {
    if (comment) {
      setValue('title', comment.title);
      setValue('comment', comment.comment);
      setValue('source', comment.source ? comment.source.url : '');
      setTags(comment.tags ? comment.tags.map((item) => ({ label: item.label, value: item.tag })) : []);
    }
  }, [comment, setValue]);

  const getTagsValue = (newValue) => {
    const existingTags = [];
    const newTags = [];
    if (newValue) {
      newValue.forEach((item) => {
        const { __isNew__, label, value } = item;
        if (__isNew__) {
          const isTagAlreadyExists = find(tagsState.tags, ((tag) => tag.label.toLowerCase() === label.toLowerCase()));
          if (isTagAlreadyExists) {
            existingTags.push(isTagAlreadyExists._id);
            return;
          }
          newTags.push({
            label,
            isActive: true,
            type: 'custom',
          });
          return;
        }
        existingTags.push(value);
      });
    }
    return ({ existingTags, newTags });
  };

  const onSubmit = async (data) => {
    if (comment) {
      await dispatch(updateSuggestComment(comment._id, {
        ...data,
        user,
        tags: getTagsValue(tags),
        collectionId,
      }, token));
    } else {
      await dispatch(createSuggestComment({
        ...data,
        user,
        tags: getTagsValue(tags),
        collectionId,
      }, token));
    }
    reset();
    onClose();
    dispatch(getCollectionById(collectionId, token));
  };

  return (
    <div className={`modal ${active ? 'is-active' : ''}`} ref={modalRef}>
      <div className="modal-background" />
      <div className="modal-content px-10">
        <div className="p-50 has-background-white">
          <p className="has-text-black has-text-weight-bold is-size-4 mb-10">{`${comment ? 'Update' : 'Create'} a Custom Suggested Comment`}</p>
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
                <CreatableSelect
                  isMulti
                  onChange={setTags}
                  options={tagOptions}
                  placeholder="Select tags"
                  value={tags}
                />
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
                { comment ? 'Update' : 'Create'}
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
  _id: PropTypes.string,
  comment: PropTypes.any,
};

AddSuggestedCommentModal.defaultProps = {
  comment: null,
  _id: '',
};

export default AddSuggestedCommentModal;
