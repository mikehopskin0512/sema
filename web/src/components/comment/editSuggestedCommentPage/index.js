import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { validateData } from '../addSuggestedComment';
import EditSuggestedCommentForm from '../editSuggestedCommentForm';
import { makeTagsList, parseRelatedLinks } from '../../../utils';
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
  const [comments, setComments] = useState([]);
  const [errors, setErrors] = useState({});

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
    setComments(suggestedComments.map((comment) => ({
      ...comment,
      sourceName: comment.source && comment.source.name,
      sourceLink: comment.source && comment.source.url,
      languages: addTags(comment.tags, ['language']),
      guides: addTags(comment.tags, ['other', 'guide', 'custom']),
    })));
  }, [suggestedComments]);

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
        relatedLinks: comment.relatedLinks ? parseRelatedLinks(comment.relatedLinks.toString()) : '',
      } : null;
    });

    if (data[0]) {
      await dispatch(bulkUpdateSuggestedComments({ comments: data }, token));
      await router.push(`${PATHS.SNIPPETS._}?cid=${collection._id}`);
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
            onClick={onSave}
          >
            <FontAwesomeIcon icon={faCheck} className="mr-10" />
            Save Snippet
          </button>
        </div>
      </div>
      <div className="px-10">
        {
          comments.map((item, index) => (
            <div key={item._id || index} style={{ borderBottom: '1px solid #dbdbdb' }} className="mb-50 pb-50">
              <EditSuggestedCommentForm
                comment={item}
                onChange={(e) => onChange(e, index)}
                collection={collection}
                errors={errors}
              />
            </div>
          ))
        }
      </div>
    </>
  );
};

export default EditSuggestedCommentPage;
