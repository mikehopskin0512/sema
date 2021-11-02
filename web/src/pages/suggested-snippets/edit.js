import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Helmet from '../../components/utils/Helmet';
import { commentsOperations } from '../../state/features/comments';
import withLayout from '../../components/layout';
import EditSuggestedCommentPage from '../../components/comment/editSuggestedCommentPage';
import EditCommentCollectionPage from '../../components/comment/editCommentCollectionPage';

const { getCollectionById } = commentsOperations;

const EditCollectionPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { auth, collectionState } = useSelector((state) => ({
    auth: state.authState,
    collectionState: state.commentsState,
  }));

  const { cid: collectionId, comments } = router.query;

  const { token } = auth;
  const { collection } = collectionState;

  useEffect(() => {
    dispatch(getCollectionById(collectionId, token));
  }, [collectionId, dispatch, token]);

  return (
    <div className="has-background-gray-9 hero">
      <Helmet title={comments ? "Edit suggested snippets" : "Edit snippet collection"} />
      <div className="hero-body pb-250">
        <div className="is-flex is-align-items-center px-10 mb-25">
          <a href="/suggested-snippets" className="is-hidden-mobile">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-10" color="#000" />
          </a>
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li><a href="/suggested-snippets" className="has-text-grey">Suggested Snippets</a></li>
              { comments ? (
                <>
                  <li className="has-text-weight-semibold"><a className="has-text-grey" href={`/suggested-snippets?cid=${collection._id}`}>{collection.name}</a></li>
                  <li className="is-active has-text-weight-semibold"><a>Edit Suggested Snippets</a></li>
                </>
              ) : (
                <li className="is-active has-text-weight-semibold"><a>Edit a Snippet Collection</a></li>
              ) }
            </ul>
          </nav>
        </div>
        { comments ? (
          <EditSuggestedCommentPage commentIds={comments} />
        ) : (
          <EditCommentCollectionPage />
        ) }
      </div>
    </div>
  );
};

export default withLayout(EditCollectionPage);
