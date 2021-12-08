import React  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Helmet from '../../components/utils/Helmet';
import { commentsOperations } from '../../state/features/comments';
import withLayout from '../../components/layout';
import withSnippetsPermission from '../../components/auth/withSnippetsPermission';
import { ArrowLeftIcon } from '../../components/Icons';
import EditSuggestedCommentPage from '../../components/comment/editSuggestedCommentPage';
import EditCommentCollectionPage from '../../components/comment/editCommentCollectionPage';
import { PATHS } from '../../utils/constants';
import useAuthEffect from '../../hooks/useAuthEffect';

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

  useAuthEffect(() => {
    dispatch(getCollectionById(collectionId, token));
  }, [collectionId]);

  return (
    <div className="has-background-gray-200 hero">
      <Helmet title={comments ? "Edit snippets" : "Edit snippet collection"} />
      <div className="hero-body pb-250">
        <div className="is-flex is-align-items-center px-10 mb-25">
          <a href={PATHS.SNIPPETS._} className="is-hidden-mobile mr-8 is-flex">
            <ArrowLeftIcon color="#000" size="small" />
          </a>
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li><a href={PATHS.SNIPPETS._} className="has-text-grey">Snippets</a></li>
              { comments ? (
                <>
                  <li className="has-text-weight-semibold"><a className="has-text-grey" href={`${PATHS.SNIPPETS._}?cid=${collection._id}`}>{collection.name}</a></li>
                  <li className="is-active has-text-weight-semibold"><a>Edit Snippets</a></li>
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

export default withSnippetsPermission(withLayout(EditCollectionPage), 'canEditSnippets');
