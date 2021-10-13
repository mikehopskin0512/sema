import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { validateData } from './add';
import { tagsOperations } from '../../state/features/tags';
import Helmet from '../../components/utils/Helmet';
import { commentsOperations } from '../../state/features/comments';
import { suggestCommentsOperations } from '../../state/features/suggest-comments';
import withLayout from '../../components/layout';
import EditSuggestedCommentForm from '../../components/comment/editSuggestedCommentForm';
import { makeTagsList, parseRelatedLinks } from '../../utils';

const { fetchTagList } = tagsOperations;
const { getCollectionById } = commentsOperations;
const { bulkUpdateSuggestedComments, getAllSuggestComments } = suggestCommentsOperations;

const EditCollectionPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [errors, setErrors] = useState({});

  const { auth, collectionState, suggestCommentsState } = useSelector((state) => ({
    auth: state.authState,
    collectionState: state.commentsState,
    suggestCommentsState: state.suggestCommentsState,
  }));

  const { cid: collectionId, comments: commentIds } = router.query;
  const { token } = auth;
  const { collection } = collectionState;
  const { suggestedComments } = suggestCommentsState;

  useEffect(() => {
    dispatch(getCollectionById(collectionId, token));
  }, [collectionId, dispatch, token]);

  useEffect(() => {
    const ids = commentIds.split(',');
    dispatch(getAllSuggestComments({ comments: ids }, token));
  }, [dispatch, token, commentIds]);

  useEffect(() => {
    dispatch(fetchTagList(token));
  }, [dispatch, token]);

  useEffect(() => {
    setComments(suggestedComments.map((comment) => ({
      ...comment,
      languages: comment.tags.filter((tag) => tag.tag && tag.type === 'language').map((t) => ({ value: t.tag, label: t.label, type: t.type })),
      guides: comment.tags.filter((tag) => tag.tag && tag.type === 'guide').map((t) => ({ value: t.tag, label: t.label, type: t.type })),
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
        relatedLinks: comment.relatedLinks ? parseRelatedLinks(comment.relatedLinks.toString()) : '',
      }
    });

    if (data[0]) {
      await dispatch(bulkUpdateSuggestedComments({ comments: data }, token));
      await router.push(`/suggested-comments?cid=${collection._id}`);
    }
  };

  return (
    <div className="has-background-gray-9 hero">
      <Helmet title="Add a Suggested Comments" />
      <div className="hero-body pb-250">
        <div className="is-flex is-align-items-center px-10 mb-25">
          <a href="/suggested-comments" className="is-hidden-mobile">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-10" color="#000" />
          </a>
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li><a href="/suggested-comments" className="has-text-grey">Suggested Comments</a></li>
              <li className="has-text-weight-semibold"><a className="has-text-grey" href={`/suggested-comments?cid=${collection._id}`}>{collection.name}</a></li>
              <li className="is-active has-text-weight-semibold"><a>Edit Suggested Comments</a></li>
            </ul>
          </nav>
        </div>
        <div className="is-flex px-10 mb-25 is-justify-content-space-between is-align-items-center">
          <div className="is-flex is-flex-wrap-wrap is-align-items-center">
            <p className="has-text-weight-semibold has-text-deep-black is-size-4 mr-10">
              Edit Suggested Comments
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
      </div>
    </div>
  );
};

export default withLayout(EditCollectionPage);
