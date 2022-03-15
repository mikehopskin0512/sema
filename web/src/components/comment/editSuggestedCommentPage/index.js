import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import SnippetForm from '../snippetForm';
import { tagsOperations } from '../../../state/features/tags';
import { suggestCommentsOperations } from '../../../state/features/suggest-snippets';
import { PATHS } from '../../../utils/constants';
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


  const onCancel = async () => {
    await router.back();
  };
  const onSubmit = async (comments) => {
    try {
      await dispatch(bulkUpdateSuggestedComments({ comments }, token));
      await router.push(`${PATHS.SNIPPETS._}?cid=${collection._id}`);
    } catch (e) {
      // TODO: add a notification / after BE error fixes
    }
  };
  return (
    <SnippetForm
      comment={comment}
      onSubmit={onSubmit}
      onCancel={onCancel}
      collection={collection}
    />
  );
};

export default EditSuggestedCommentPage;
