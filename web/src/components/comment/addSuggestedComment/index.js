import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import SnippetForm from '../snippetForm';
import { suggestCommentsOperations } from '../../../state/features/suggest-snippets';
import { commentsOperations } from '../../../state/features/comments';
import { PATHS } from '../../../utils/constants';
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
        sourceName: collection.source?.name,
        author: collection.author,
        languages: collection.tags?.filter((item) => item.type === 'language') || [],
        guides: collection.tags?.filter((item) => item.type !== 'language') || [],
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
