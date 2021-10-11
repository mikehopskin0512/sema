import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { tagsOperations } from '../../state/features/tags';
import Helmet from '../../components/utils/Helmet';
import { commentsOperations } from '../../state/features/comments';
import { suggestCommentsOperations } from '../../state/features/suggest-comments';
import withLayout from '../../components/layout';
import EditSuggestedCommentForm from '../../components/comment/editSuggestedCommentForm';
import { makeTagsList, parseRelatedLinks } from '../../utils';

const { fetchTagList } = tagsOperations;
const { getCollectionById } = commentsOperations;
const { bulkCreateSuggestedComments } = suggestCommentsOperations;

const initialValues = {
  title: '',
  source: {
    name: '',
    url: '',
  },
  tags: [],
  comment: '',
};

const defaultValues = {
  title: '',
  languages: [],
  guides: [],
  source: '',
  author: '',
  comment: '',
  link: '',
  relatedLinks: '',
}

const AddCollectionPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [comments, setComments] = useState([defaultValues]);

  const { auth, collectionState } = useSelector((state) => ({
    auth: state.authState,
    collectionState: state.commentsState,
  }));

  const { cid: collectionId } = router.query;
  const { token } = auth;
  const { collection } = collectionState;

  useEffect(() => {
    dispatch(getCollectionById(collectionId, token));
  }, [collectionId, dispatch, token]);

  useEffect(() => {
    dispatch(fetchTagList(token));
  }, [dispatch, token]);

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
    const data = comments.filter((item) => item.title).map((comment) => ({
      ...comment,
      tags: makeTagsList([...comment.languages, ...comment.guides]),
      relatedLinks: parseRelatedLinks(comment.relatedLinks),
      source: {
        name: comment.author,
        url: comment.source
      }
    }));

    if (data && data.length) {
      await dispatch(bulkCreateSuggestedComments({ comments: data, collectionId }, token));
      await router.push(`/suggested-comments?cid=${collection._id}`);
    }
  };

  return (
    <div className="has-background-gray-9 hero">
      <Helmet title="Add suggested comments" />
      <div className="hero-body pb-300">
        <div className="is-flex is-align-items-center px-10 mb-25">
          <a href={`/suggested-comments?cid=${collection._id}`} className="is-hidden-mobile">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-10" color="#000" />
          </a>
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li><a href="/suggested-comments" className="has-text-grey">Suggested Comments</a></li>
              <li className="has-text-weight-semibold"><a className="has-text-grey" href={`/suggested-comments?cid=${collection._id}`}>{collection.name}</a></li>
              <li className="is-active has-text-weight-semibold"><div className="px-5">Add Suggested Comments</div></li>
            </ul>
          </nav>
        </div>
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
              <div key={item._id || index} style={{ borderBottom: '1px solid #dbdbdb' }} className="mb-25 pb-25">
                <EditSuggestedCommentForm
                  comment={item}
                  onChange={(e) => onChange(e, index)}
                  collection={collection}
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
          <button
            className="button is-small is-outlined is-primary border-radius-4px"
            type="button"
            onClick={addComment}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-10" />
            Add another comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default withLayout(AddCollectionPage);
