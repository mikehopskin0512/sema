import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import EditSuggestedCommentForm from '../editSuggestedCommentForm';
import { suggestCommentsOperations } from '../../../state/features/suggest-comments';
import { commentsOperations } from '../../../state/features/comments';
import { makeTagsList, parseRelatedLinks } from '../../../utils';

const { getCollectionById } = commentsOperations;
const { bulkCreateSuggestedComments } = suggestCommentsOperations;

const defaultValues = {
  title: '',
  languages: [],
  guides: [],
  source: {
    url: '',
    name: ''
  },
  author: '',
  comment: '',
  link: '',
  relatedLinks: '',
}

const requiredFields = {
  title: 'Title is required',
  languages: 'At least one language is required',
  guides: 'At least one guide is required',
  source: 'Source is required',
  author: 'Author is required',
  comment: 'Body is required'
};

export const validateData = (data, setErrors) => {
  const keys = Object.keys(data);
  const errorFields = {};
  keys.filter((key) => {
    const requiredFieldsKeys = Object.keys(requiredFields);
    if (requiredFieldsKeys.includes(key)) {
      if (key === 'source') {
        return !data[key].url
      }
      return !data[key] || data[key].length < 1
    }
  }).forEach((key) => {
    errorFields[key] = {
      message: requiredFields[key]
    }
  });
  if (Object.keys(errorFields).length > 0) {
    setErrors(errorFields);
    return false;
  }
  return true;
};

const AddSuggestedComment = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = props;
  const [comments, setComments] = useState([defaultValues]);
  const [errors, setErrors] = useState({});

  const { cid: collectionId } = router.query;

  useEffect(() => {
    dispatch(getCollectionById(collectionId, token));
  }, [collectionId, dispatch, token]);

  const addComment = () => {
    setComments([...comments, defaultValues]);
  };

  const removeComment = (index) => {
    setComments(comments.filter((_comment, idx) => index !== idx));
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
    setErrors({});
    const data = comments.map((comment) => {
      const isDataValid = validateData(comment, setErrors);
      if (!isDataValid) {
        return;
      }

      let sourceName = '';
      const re = new RegExp("^(http|https)://", "i");
      if (re.test(comment.source?.url)) {
        sourceName =  new URL(comment.source.url).hostname
      } else {
        setErrors({
          source: {
            message: 'Source should be a URL'
          }
        });
        return;
      }

      return {
        ...comment,
        source: {
          url: comment.source.url,
          name: sourceName
        },
        tags: makeTagsList([...comment.languages, ...comment.guides]),
        relatedLinks: parseRelatedLinks(comment.relatedLinks),
      }
    });

    if (data[0]) {
      await dispatch(bulkCreateSuggestedComments({ comments: data, collectionId }, token));
      await router.push(`/suggested-comments?cid=${collection._id}`);
    }
  };

  return(
    <>
      <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center">
        <div className="is-flex is-flex-wrap-wrap is-align-items-center">
          <p className="has-text-weight-semibold has-text-deep-black is-size-4 mr-10">
            Add a Suggested Comment
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
            <div key={item._id || index} style={{ borderBottom: '1px solid #dbdbdb' }} className="mb-25 pb-25">
              <EditSuggestedCommentForm
                comment={item}
                onChange={(e) => onChange(e, index)}
                collection={collection}
                errors={errors}
              />
              { index > 0 && (
                <div className="is-flex is-justify-content-flex-end">
                  <button
                    className="button is-small is-danger is-outlined border-radius-4px"
                    type="button"
                    onClick={() => removeComment(index)}
                  >
                    <FontAwesomeIcon icon={faTimes} className="mr-10" />
                    Remove comment
                  </button>
                </div>
              ) }
            </div>
          ))
        }
        {/* <button
          className="button is-small is-outlined is-primary border-radius-4px"
          type="button"
          onClick={addComment}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-10" />
          Add another comment
        </button> */}
      </div>
    </>
  )
}

export default AddSuggestedComment;