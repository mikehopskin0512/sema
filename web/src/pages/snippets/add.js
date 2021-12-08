import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { tagsOperations } from '../../state/features/tags';
import Helmet from '../../components/utils/Helmet';
import { ArrowLeftIcon } from '../../components/Icons';
import withLayout from '../../components/layout';
import withSnippetsPermission from '../../components/auth/withSnippetsPermission';
import AddCommentCollection from '../../components/comment/addCommentCollection';
import AddSuggestedComment from '../../components/comment/addSuggestedComment';
import { PATHS } from '../../utils/constants';
import useAuthEffect from '../../hooks/useAuthEffect';

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
  const parentPageUrl = cid ? `${PATHS.SNIPPETS._}?cid=${cid}` : PATHS.SNIPPETS._;

  useAuthEffect(() => {
    dispatch(fetchTagList(token));
  }, []);

  return (
    <div className="has-background-gray-200 hero">
      <Helmet title={cid ? "Add suggested snippet" : "Add a snippet collection"} />
      <div className="hero-body pb-300">
        <div className="is-flex is-align-items-center px-10 mb-25">
          <a href={parentPageUrl} className="is-hidden-mobile mr-8 is-flex">
            <ArrowLeftIcon color="#000" size="small" />
          </a>
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li><a href={PATHS.SNIPPETS._} className="has-text-grey">Snippets</a></li>
              { cid ? (
                <>
                  <li className="has-text-weight-semibold"><a className="has-text-grey" href={`${PATHS.SNIPPETS._}?cid=${collection._id}`}>{collection.name}</a></li>
                  <li className="is-active has-text-weight-semibold"><div className="px-5">Add Snippets</div></li>
                </>
              ) : (<li className="is-active has-text-weight-semibold"><div className="px-5">Add a Snippet Collection</div></li>) }
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

export default withSnippetsPermission(withLayout(AddCollectionPage), 'canCreateSnippets');
