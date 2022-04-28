import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { addTags } from '../../../utils';
import SnippetForm from '../snippetForm';
import { suggestCommentsOperations } from '../../../state/features/suggest-snippets';
import { commentsOperations } from '../../../state/features/comments';
import { PATHS, TAG_TYPE } from '../../../utils/constants';
import useAuthEffect from '../../../hooks/useAuthEffect';

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
    auth: { token, user },
    collectionState,
    tags,
  } = useSelector((state) => ({
    auth: state.authState,
    tags: state.tagsState.tags,
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
    if (collection._id) {
      setComment({
        ...comment,
        sourceName: collection.source?.name,
        author: `${user?.firstName} ${user?.lastName}`,
        languages: addTags(collection.tags, [TAG_TYPE.LANGUAGE]),
        guides: addTags(collection.tags, [TAG_TYPE.GUIDE, TAG_TYPE.CUSTOM]),
      });
    }
  }, [collection]);
  const onCancel = async () => {
    await router.back();
  };

  const onSubmit = async (comments) => {
    try {
      await dispatch(bulkCreateSuggestedComments({ comments, collectionId }, token));
      await router.push(`${PATHS.SNIPPETS._}?cid=${collection._id}`);
    } catch (e) {
      // TODO: add an error notificaiton
    }
  };
  return (
    <SnippetForm
      isNewSnippet
      comment={comment}
      onSubmit={onSubmit}
      onCancel={onCancel}
      collection={collection}
    />
  );
};

export default AddSuggestedComment;
