import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { tagsOperations } from '../../state/features/tags';
import Helmet from '../../components/utils/Helmet';
import withLayout from '../../components/layout';
import AddCommentCollection from '../../components/comment/AddCommentCollection';
import AddSuggestedComment from '../../components/comment/addSuggestedComment';

const { fetchTagList } = tagsOperations;

const AddCollectionPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { auth, collectionState } = useSelector((state) => ({
    auth: state.authState,
    collectionState: state.commentsState,
  }));

  const { cid } = router.query;
  const { token } = auth;
  const { collection } = collectionState;

  useEffect(() => {
    dispatch(fetchTagList(token));
  }, [dispatch, token]);

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
              { cid ? (
                <>
                  <li className="has-text-weight-semibold"><a className="has-text-grey" href={`/suggested-comments?cid=${collection._id}`}>{collection.name}</a></li>
                  <li className="is-active has-text-weight-semibold"><div className="px-5">Add Suggested Comments</div></li>
                </>
              ) : (<li className="is-active has-text-weight-semibold"><div className="px-5">Add a Comment Collection</div></li>) }
            </ul>
          </nav>
        </div>
        { cid ? (
          <AddSuggestedComment token={token} />
        ) : (
          <AddCommentCollection />
        ) }
      </div>
    </div>
  );
};

export default withLayout(AddCollectionPage);
