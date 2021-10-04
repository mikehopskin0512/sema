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

const AddSuggestedComment = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = props;
  const [comments, setComments] = useState([initialValues]);

  const { cid: collectionId } = router.query;

  useEffect(() => {
    dispatch(getCollectionById(collectionId, token));
  }, [collectionId, dispatch, token]);

  const addComment = () => {
    setComments([...comments, initialValues]);
  };

  const onChange = (value, index) => {
    setComments(comments.map((comment, i) => i === index ? ({
      ...comment,
      ...value,
    }) : comment));
  };

  const onCancel = async () => {
    await router.back();
  };

  const onSave = async () => {
    const data = comments.filter((item) => item.title).map((comment) => ({
      ...comment,
      tags: makeTagsList(comment.tags),
    }));

    if (data && data.length) {
      await dispatch(bulkCreateSuggestedComments({ comments: data, collectionId }, token));
      await router.push(`/suggested-comments?cid=${collectionId}`);
    }
  };

  return(
    <>
      <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center">
        <div className="is-flex is-flex-wrap-wrap is-align-items-center">
          <p className="has-text-weight-semibold has-text-deep-black is-size-4 mr-10">
            Add Suggested Comments
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
            onClick={onSave}
          >
            <FontAwesomeIcon icon={faCheck} className="mr-10" />
            Save
          </button>
        </div>
      </div>
      <div className="px-10">
        {
          comments.map((item, index) => (
            <EditSuggestedCommentForm
              key={item._id || index}
              comment={item}
              onChange={(e) => onChange(e, index)}
            />
          ))
        }
        <button
          className="button is-small is-outlined is-primary border-radius-4px"
          type="button"
          onClick={addComment}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-10" />
          Add another comment
        </button>
      </div>
    </>
  )
}

export default AddSuggestedComment;