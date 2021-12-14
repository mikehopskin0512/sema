import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { CheckOnlineIcon } from '../../Icons';
import EditSuggestedCommentForm from '../editSuggestedCommentForm';
import { suggestCommentsOperations } from '../../../state/features/suggest-snippets';
import { commentsOperations } from '../../../state/features/comments';
import { makeTagsList, parseRelatedLinks } from '../../../utils';
import { PATHS } from '../../../utils/constants';
import useAuthEffect from '../../../hooks/useAuthEffect';
import { useValidateCommentForm } from '../helpers';
import { gray300 } from '../../../../styles/_colors.module.scss';

const { getCollectionById } = commentsOperations;
const { bulkCreateSuggestedComments } = suggestCommentsOperations;

const defaultValues = {
  title: '',
  languages: [],
  guides: [],
  sourceName: '',
  sourceLink: '',
  author: '',
  comment: '',
  link: '',
  relatedLinks: '',
};

const AddSuggestedComment = () => {
  const dispatch = useDispatch();
  const {
    auth: { token },
    collectionState,
  } = useSelector((state) => ({
    auth: state.authState,
    collectionState: state.commentsState,
  }));
  const router = useRouter();
  const [comment, setComment] = useState({ ...defaultValues });
  const { cid: collectionId } = router.query;
  const { collection } = collectionState;

  useAuthEffect(() => {
    dispatch(getCollectionById(collectionId, token));
  }, [collectionId]);

  useEffect(() => {
    if (collection) {
      setComment({
        ...comment,
        sourceName: collection.source && collection.source.name,
        author: collection.author,
        languages: collection.tags ? collection.tags.filter((item) => item.type === 'language') : [],
        guides: collection.tags ? collection.tags.filter((item) => item.type !== 'language') : [],
      });
    }
  }, [collection]);
  const { isValid, errors, validate } = useValidateCommentForm(comment);
  const onCancel = async () => {
    await router.back();
  };
  const onChange = (value) => {
    setComment({
      ...comment,
      ...value,
    });
  };
  const save = async () => {
    const comments = [{
      ...comment,
      source: {
        name: comment.sourceName,
        url: comment.sourceLink,
      },
      tags: makeTagsList([...comment.languages, ...comment.guides]),
      relatedLinks: parseRelatedLinks(comment.relatedLinks),
    }];
    await dispatch(bulkCreateSuggestedComments({ comments, collectionId }, token));
    await router.push(`${PATHS.SNIPPETS._}?cid=${collection._id}`);
  };
  const onSubmit = async () => {
    validate();
    if (!isValid) {
      return;
    }
    try {
      await save();
    } catch (e) {
      // TODO: add a notification / after BE error fixes
    }
  };
  return (
    <>
      <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center">
        <div className="is-flex is-flex-wrap-wrap is-align-items-center">
          <p className="has-text-weight-semibold has-text-black-950 is-size-4 mr-10">
            Create New Snippet
          </p>
        </div>
        <div className="is-flex">
          <button
            className="button is-small is-outlined is-primary border-radius-4px mr-10"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="button is-small is-primary border-radius-4px"
            type="button"
            onClick={onSubmit}
          >
            <CheckOnlineIcon size="small" />
            <span className="ml-8">
              Save New Snippet
            </span>
          </button>
        </div>
      </div>
      <div className="px-10">
        <div
          style={{ borderBottom: `1px solid ${gray300}` }}
          className="mb-25 pb-25"
        >
          <EditSuggestedCommentForm
            comment={comment}
            onChange={onChange}
            collection={collection}
            errors={errors}
          />
        </div>
      </div>
    </>
  );
};

export default AddSuggestedComment;
