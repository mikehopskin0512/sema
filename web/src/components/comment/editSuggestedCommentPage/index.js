import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import EditSuggestedCommentForm from '../editSuggestedCommentForm';
import { makeTagsList, parseRelatedLinks } from '../../../utils';
import { tagsOperations } from '../../../state/features/tags';
import { suggestCommentsOperations } from '../../../state/features/suggest-snippets';
import { PATHS } from '../../../utils/constants';
import { useValidateCommentForm } from '../../../components/comment/helpers';
import useAuthEffect from '../../../hooks/useAuthEffect';
import { addTags } from '../../../utils';

const { fetchTagList } = tagsOperations;
const { bulkUpdateSuggestedComments, getAllSuggestComments } = suggestCommentsOperations;

const EditSuggestedCommentPage = ({ commentIds }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [comment, setComment] = useState({});

  const { auth, collectionState, suggestSnippetsState } = useSelector((state) => ({
    auth: state.authState,
    collectionState: state.commentsState,
    suggestSnippetsState: state.suggestSnippetsState,
  }));

  const { token } = auth;
  const { collection } = collectionState;
  const { suggestedComments } = suggestSnippetsState;

  useAuthEffect(() => {
    const ids = commentIds.split(',');
    dispatch(getAllSuggestComments({ comments: ids }, token));
  }, [commentIds]);

  useAuthEffect(() => {
    dispatch(fetchTagList(token));
  }, []);

  useEffect(() => {
    const defaultValues = suggestedComments[0];
    if (!defaultValues) {
      return
    }
    setComment({
      ...defaultValues,
      sourceName: defaultValues.source?.name,
      sourceLink: defaultValues.source?.url,
      languages: addTags(defaultValues.tags, ['language']),
      guides: addTags(defaultValues.tags, ['other', 'guide', 'custom']),
    });
  }, [suggestedComments]);

  const onChange = (value) => {
    setComment({
      ...comment,
      ...value,
    });
  };

  const onCancel = async () => {
    await router.back();
  };
  const { isValid, errors, validate } = useValidateCommentForm(comment);
  const update = async () => {
    const comments = [{
      ...comment,
      source: {
        name: comment.sourceName,
        url: comment.sourceLink,
      },
      tags: makeTagsList([...comment.languages, ...comment.guides]),
      relatedLinks: comment.relatedLinks ? parseRelatedLinks(comment.relatedLinks.toString()) : '',
    }];
    await dispatch(bulkUpdateSuggestedComments({ comments }, token));
    await router.push(`${PATHS.SNIPPETS._}?cid=${collection._id}`);
  };
  const onSubmit = async () => {
    validate();
    if (!isValid) {
      return;
    }
    try {
      await update();
    } catch (e) {
      // TODO: add a notification / after BE error fixes
    }
  };

  return (
    <>
      <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center">
        <div className="is-flex is-flex-wrap-wrap is-align-items-center">
          <p className="has-text-weight-semibold has-text-black-950 is-size-4 mr-10">
            Edit Snippet
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
            <FontAwesomeIcon icon={faCheck} className="mr-10" />
            Save Snippet
          </button>
        </div>
      </div>
      <div className="px-10">
        <div
          style={{ borderBottom: '1px solid #dbdbdb' }}
          className="mb-50 pb-50"
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

export default EditSuggestedCommentPage;
