import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { CheckOnlineIcon, CloseIcon } from '../../Icons';
import EditSuggestedCommentForm from '../editSuggestedCommentForm';
import { suggestCommentsOperations } from '../../../state/features/suggest-snippets';
import { commentsOperations } from '../../../state/features/comments';
import { makeTagsList, parseRelatedLinks } from '../../../utils';
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

const requiredFields = {
  title: 'Title is required',
  languages: 'At least one language is required',
  guides: 'At least one guide is required',
  sourceName: 'Source Name is required',
  sourceLink: 'Source Link is required',
  author: 'Author is required',
  comment: 'Body is required'
};

export const validateData = (data, setErrors) => {
  const errorFields = {};
  const keys = Object.keys(requiredFields);
  keys.filter((key) => !data[key] || data[key].length < 1).forEach((key) => {
    errorFields[key] = {
      message: requiredFields[key],
    };
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
  const { collectionState } = useSelector((state) => ({
    collectionState: state.commentsState,
  }));

  const { cid: collectionId } = router.query;
  const { collection } = collectionState;

  useAuthEffect(() => {
    dispatch(getCollectionById(collectionId, token));
  }, [collectionId]);

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

      const re = new RegExp("^(http|https)://", "i");
      if (!re.test(comment.sourceLink)) {
        setErrors({
          sourceLink: {
            message: 'Source should be a URL'
          }
        });
        return;
      }

      return isDataValid ? {
        ...comment,
        source: {
          name: comment.sourceName,
          url: comment.sourceLink,
        },
        tags: makeTagsList([...comment.languages, ...comment.guides]),
        relatedLinks: parseRelatedLinks(comment.relatedLinks),
      } : null;
    });

    if (data[0]) {
      await dispatch(bulkCreateSuggestedComments({ comments: data, collectionId }, token));
      await router.push(`${PATHS.SUGGESTED_SNIPPETS._}?cid=${collection._id}`);
    }
  };

  return (
    <>
      <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center">
        <div className="is-flex is-flex-wrap-wrap is-align-items-center">
          <p className="has-text-weight-semibold has-text-deep-black is-size-4 mr-10">
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
            onClick={onSave}
          >
            <CheckOnlineIcon size="small" />
            <span className="ml-8">
              Save New Snippet
            </span>
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
                    <CloseIcon size="small" />
                    <span className="ml-8">
                      Remove snippet
                    </span>
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
  );
};

export default AddSuggestedComment;
