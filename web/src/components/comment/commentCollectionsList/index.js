import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import styles from './commentCollectionsList.module.scss';
import AddSuggestedCommentModal from '../addSuggestedCommentModal';
import CardList from '../cardList';
import Helmet, { CommentCollectionsHelmet } from '../../utils/Helmet';
import GlobalSearch from '../../globalSearch';
import Loader from '../../Loader';
import Toaster from '../../toaster';
import { DEFAULT_COLLECTION_NAME } from '../../../utils/constants';
import { collectionsOperations } from "../../../state/features/collections";
import { alertOperations } from '../../../state/features/alerts';

const { clearAlert } = alertOperations;
const { fetchAllUserCollections } = collectionsOperations;

const NUM_PER_PAGE = 9;

const CommentCollectionsList = () => {
  const dispatch = useDispatch();
  const { auth, collectionsState, alerts } = useSelector((state) => ({
    auth: state.authState,
    collectionsState: state.collectionsState,
    alerts: state.alertsState,
  }));
  const { showAlert, alertType, alertLabel } = alerts;
  const { token, user } = auth;  
  const { isSemaAdmin } = user;
  const { data = [] , isFetching } = collectionsState;

  const [collectionId, setCollectionId] = useState(null);
  const [page, setPage] = useState(1);

  const sortedCollections = useMemo(() => {
    let collections = [...data];
    if (!isSemaAdmin) {
      collections = collections.filter((collection) => collection?.collectionData?.isActive);
    }
    collections = collections.sort((_a, _b) => {
      const a = _a.collectionData?.name.toLowerCase();
      const b = _b.collectionData?.name.toLowerCase();
      if (a === DEFAULT_COLLECTION_NAME) return -1;
      if (b === DEFAULT_COLLECTION_NAME) return 1;
      return a >= b ? 1 : -1
    });
    return collections;
  }, [data]);
  
  const isNewCommentModalOpen = !!collectionId;

  const activeCollections = sortedCollections.filter((collection) => collection.isActive);
  const otherCollections = sortedCollections.filter((collection) => !collection.isActive);

  useEffect(() => {
    dispatch(fetchAllUserCollections(token));
  }, []);

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  const openNewSuggestedCommentModal = (_id) => {
    const element = document.getElementById('#collectionBody');
    setCollectionId(_id);
    window.scrollTo({
      behavior: element ? 'smooth' : 'auto',
      top: element ? element.offsetTop : 0,
    });
  };

  const closeNewSuggestedCommentModal = () => {
    setCollectionId(null);
  };

  const viewMore = () => {
    setPage(page + 1);
  };

  if (isFetching) {
    return(
      <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '60vh' }}>
        <Loader/>
      </div>
    )
  }
  
  return(
    <div className={clsx(isNewCommentModalOpen ? styles['overflow-hidden'] : null)}>
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
      <Helmet {...CommentCollectionsHelmet} />
      <AddSuggestedCommentModal _id={collectionId} active={isNewCommentModalOpen} onClose={closeNewSuggestedCommentModal} inCollectionsPage />
      <div id="collectionBody" className={clsx(isNewCommentModalOpen ? styles['overflow-hidden'] : null)}>
        <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap p-10">
          <p className="has-text-weight-semibold has-text-deep-black is-size-3">
            Suggested Comments
          </p>
          <div className="is-flex is-align-items-center is-flex-wrap-wrap">
            <div className="mr-10">
              <GlobalSearch />
            </div>
            { isSemaAdmin && (
              <a href="/suggested-comments/add">
                <button
                  className="button is-small is-primary border-radius-4px my-10 has-text-weight-semibold"
                  type="button"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-10" />
                  Add a Comment Collection
                </button>
              </a>
            ) }
          </div>
        </div>
        <p className="has-text-weight-semibold has-text-deep-black is-size-4 p-10">Active Collections</p>
        <p className="is-size-6 has-text-deep-black my-10 px-10">
          Comments from these collections will be suggested as you create code reviews
        </p>
        <CardList addNewComment={openNewSuggestedCommentModal} collections={activeCollections || []} />
        <p className="has-text-weight-semibold has-text-deep-black is-size-4 mt-60 p-10">Other Collections</p>
        <CardList addNewComment={openNewSuggestedCommentModal} collections={otherCollections.slice(0, NUM_PER_PAGE * page) || []} />
        <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-fullwidth my-50">
          {otherCollections.length > NUM_PER_PAGE && NUM_PER_PAGE * page < otherCollections.length && (
            <button onClick={viewMore} className="button has-background-gray-9 is-primary is-outlined has-text-weight-semibold is-size-6 has-text-primary" type="button">
              View More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentCollectionsList;