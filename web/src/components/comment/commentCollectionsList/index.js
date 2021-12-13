import { PlusIcon } from '../../Icons';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CardList from '../cardList';
import Helmet, { SnippetCollectionsHelmet } from '../../utils/Helmet';
import GlobalSearch from '../../globalSearch';
import Loader from '../../Loader';
import Toaster from '../../toaster';
import { DEFAULT_COLLECTION_NAME, PATHS, SEMA_CORPORATE_TEAM_ID } from '../../../utils/constants';
import { collectionsOperations } from "../../../state/features/collections";
import { alertOperations } from '../../../state/features/alerts';
import usePermission from '../../../hooks/usePermission';
import Pagination from '../../../components/pagination';
import { commentsOperations } from '../../../state/features/comments';

const { clearAlert } = alertOperations;
const { fetchAllUserCollections } = collectionsOperations;
const { getCollectionById } = commentsOperations;

const NUM_PER_PAGE = 9;

const CommentCollectionsList = () => {
  const dispatch = useDispatch();
  const { checkAccess, isSemaAdmin } = usePermission();
  const { auth, collectionsState, alerts } = useSelector((state) => ({
    auth: state.authState,
    collectionsState: state.collectionsState,
    alerts: state.alertsState,
  }));
  const { showAlert, alertType, alertLabel } = alerts;
  const { token, user } = auth;
  const { data = [] , isFetching } = collectionsState;

  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const canCreate = checkAccess(SEMA_CORPORATE_TEAM_ID, 'canCreateCollections');

  const setDefaultCollectionAsActive = () => {
    const collection = data.find((collection) => collection?.collectionData?.name?.toLowerCase() === DEFAULT_COLLECTION_NAME);
    if(collection?.collectionData?._id) {
      dispatch(getCollectionById(collection.collectionData._id, token));
    }
  };

  const sortedCollections = useMemo(() => {
    let collections = [...data];
    if (!isSemaAdmin()) {
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

  const activeCollections = sortedCollections.filter((collection) => collection.isActive);
  const otherCollections = sortedCollections.filter((collection) => !collection.isActive);

  useEffect(() => {
    dispatch(fetchAllUserCollections(token));
  }, []);

  useEffect(() => {
    setDefaultCollectionAsActive();
  }, [data]);

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  const viewMore = () => {
    setPage(page + 1);
  };

  const filteredActiveCollections = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + parseInt(pageSize, 10);
    // PUT OTHER FILTERS HERE
    const filteredCollections = activeCollections.slice(firstPageIndex, lastPageIndex);
    return filteredCollections;
  }, [currentPage, pageSize, isFetching]);

  if (isFetching) {
    return (
      <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '60vh' }}>
        <Loader />
      </div>
    )
  }

  return (
    <div>
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
      <Helmet {...SnippetCollectionsHelmet} />
      <div id="collectionBody">
        <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap p-10">
          <p className="has-text-weight-semibold has-text-black-950 is-size-3">
            Snippets
          </p>
          <div className="is-flex is-align-items-center is-flex-wrap-wrap">
            <div className="mr-10">
              <GlobalSearch />
            </div>
            { canCreate && (
              <a href={PATHS.SNIPPETS.ADD}>
                <button
                  className="button is-small is-primary border-radius-4px my-10 has-text-weight-semibold"
                  type="button"
                >
                  <PlusIcon size="small" />
                  <span className="ml-8">
                    Add a Snippet Collection
                  </span>
                </button>
              </a>
            )}
          </div>
        </div>
        <div>
          {/* Filter */}
        </div>
        <p className="has-text-weight-semibold has-text-black-950 is-size-4 p-10">Active Collections</p>
        <p className="is-size-6 has-text-black-950 my-10 px-10">
          Snippets from these collections will be suggested as you create code reviews
        </p>
        <CardList collections={filteredActiveCollections || []} />
        <p className="has-text-weight-semibold has-text-black-950 is-size-4 mt-60 p-10">Other Collections</p>
        <CardList type="others" collections={otherCollections.slice(0, NUM_PER_PAGE * page) || []} />
        <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-fullwidth my-50">
          {otherCollections.length > NUM_PER_PAGE && NUM_PER_PAGE * page < otherCollections.length && (
            <button onClick={viewMore} className="button has-background-gray-200 is-primary is-outlined has-text-weight-semibold is-size-6 has-text-primary" type="button">
              View More
            </button>
          )}
        </div>
        <div className="">
          <Pagination 
            currentPage={currentPage}
            totalCount={activeCollections.length}
            pageSize={pageSize}
            setPageSize={setPageSize}
            onPageChange={page => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}

export default CommentCollectionsList;
