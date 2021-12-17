import { PlusIcon } from '../../Icons';
import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import CollectionRow from './CollectionRow';
import CardList from '../cardList';
import SnippetCollectionAdminFilter from '../snippetCollectionAdminFilter';
import SnippetCollectionFilter from '../snippetCollectionFilter';
import Helmet, { SnippetCollectionsHelmet } from '../../utils/Helmet';
import Loader from '../../Loader';
import Toaster from '../../toaster';
import Table from '../../labels-management/LabelsTable';
import { DEFAULT_COLLECTION_NAME, PATHS, SEMA_CORPORATE_TEAM_ID } from '../../../utils/constants';
import { collectionsOperations } from "../../../state/features/collections";
import { alertOperations } from '../../../state/features/alerts';
import { EditComments } from "../../../data/permissions";
import usePermission from '../../../hooks/usePermission';
import { ListIcon, GridIcon } from '../../../components/Icons';
import Pagination from '../../../components/pagination';
import { commentsOperations } from '../../../state/features/comments';

const { clearAlert } = alertOperations;
const { fetchAllUserCollections } = collectionsOperations;
const { getCollectionById } = commentsOperations;

const CommentCollectionsList = () => {
  const dispatch = useDispatch();
  const { checkAccess, isSemaAdmin } = usePermission();
  const { auth, collectionsState, alerts } = useSelector((state) => ({
    auth: state.authState,
    collectionsState: state.collectionsState,
    alerts: state.alertsState,
  }));
  const [view, setView] = useState('grid');
  const [filter, setFilter] = useState({
    labels: [],
    languages: [],
    sources: [],
    status: [],
    authors: [],
    query: '',
  });
  const { showAlert, alertType, alertLabel } = alerts;
  const { token, user } = auth;
  const { data = [], isFetching } = collectionsState;

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
    collections = collections.filter((item) => {
      if (item.collectionData) {
        const labelsIndex = item?.collectionData.guides ? filter.labels?.findIndex((tag) => item.collectionData.guides.findIndex((commentTag) => commentTag.toLowerCase() === tag.label.toLowerCase()) !== -1) : -1;
        const languagesIndex = item?.collectionData.languages ? filter.languages?.findIndex((tag) => item.collectionData.languages.findIndex((commentTag) => commentTag.toLowerCase() === tag.label.toLowerCase()) !== -1) : -1;
        const sourcesIndex = item?.collectionData.source ? filter.sources?.findIndex((source) => source.value.toLowerCase() === item.collectionData.source.toLowerCase()) : -1;
        const authorsIndex = item?.collectionData.author ? filter.authors?.findIndex((author) => author.value.toLowerCase() === item.collectionData.author.toLowerCase()) : -1;
        const statusIndex = (typeof item?.collectionData.isActive === 'boolean') ? filter.status?.findIndex((status) => status.value === item.collectionData.isActive) : -1;

        const queryBool = item?.collectionData?.name.toLowerCase().includes(filter.query?.toLowerCase());
        let filterBool = true;
        if (filter.labels?.length > 0) {
          filterBool = filterBool && labelsIndex !== -1;
        }
        if (filter.languages?.length > 0) {
          filterBool = filterBool && languagesIndex !== -1;
        }
        if (filter.sources?.length > 0) {
          filterBool = filterBool && sourcesIndex !== -1;
        }
        if (filter.authors?.length > 0) {
          filterBool = filterBool && authorsIndex !== -1;
        }
        if (filter.status?.length > 0) {
          filterBool = filterBool && statusIndex !== -1;
        }
        if (filter.query) {
          filterBool = filterBool && queryBool;
        }
        return filterBool;
      }
      return true;
    }).sort((_a, _b) => {
      const a = _a.collectionData?.name.toLowerCase();
      const b = _b.collectionData?.name.toLowerCase();
      if (a === DEFAULT_COLLECTION_NAME) return -1;
      if (b === DEFAULT_COLLECTION_NAME) return 1;
      return a >= b ? 1 : -1
    });
    return collections;
  }, [data, filter]);

  const paginatedInactiveCollections = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + parseInt(pageSize, 10);
    // PUT OTHER FILTERS HERE
    const filteredCollections = sortedCollections.filter((collection) => !collection.isActive).slice(firstPageIndex, lastPageIndex);
    return filteredCollections;
  }, [currentPage, pageSize, isFetching, filter, sortedCollections, data]);

  const activeCollections = sortedCollections.filter((collection) => collection.isActive);
  const otherCollections = paginatedInactiveCollections;

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
        <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap p-10 mb-15">
          <p className="has-text-weight-semibold has-text-black-950 is-size-3">
            Snippets
          </p>
          <div className="is-flex is-align-items-center is-flex-wrap-wrap">
            {/* 
            <div className="mr-10">
              <GlobalSearch />
            </div>
            */}
            {canCreate && (
              <a href={PATHS.SNIPPETS.ADD} className="mr-15">
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
            <div className="is-flex">
              <button className={clsx("button border-radius-0 is-small", view === 'list' ? 'is-primary' : '')} onClick={() => setView('list')}>
                <ListIcon />
              </button>
              <button className={clsx("button border-radius-0 is-small", view === 'grid' ? 'is-primary' : '')} onClick={() => setView('grid')}>
                <GridIcon />
              </button>
            </div>
          </div>
        </div>
        {
          isSemaAdmin() ? (
            <SnippetCollectionAdminFilter
              setFilter={setFilter}
              filter={filter}
            />
          ) : (
            <SnippetCollectionFilter
              setFilter={setFilter}
              filter={filter}
            />
          )
        }
        <p className="has-text-weight-semibold has-text-black-950 is-size-4 p-10">Active Collections</p>
        <p className="is-size-6 has-text-black-950 mb-15 px-10">
          Snippets from these collections will be suggested as you create code reviews
        </p>
        {view === 'grid' ? (
          <CardList collections={activeCollections || []} />
        ) : (
          <Table
            data={activeCollections}
            columns={[{ label: 'State' }, { label: 'Collection' }, { label: 'Description' }, { label: 'Source' }, { label: 'Author' }, { label: 'Snippets', textAlign: 'center' }]}
            renderRow={(collection) => <CollectionRow data={collection} />}
            pagination={false}
          />
        )}
        <p className="has-text-weight-semibold has-text-black-950 is-size-4 mt-60 p-10">Other Collections</p>
        {view === 'grid' ? (
          <>
            <CardList type="others" collections={otherCollections.slice(0, pageSize * page) || []} />
            {/* <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-fullwidth my-50">
              {otherCollections.length > NUM_PER_PAGE && NUM_PER_PAGE * page < otherCollections.length && (
                <button onClick={viewMore} className="button has-background-gray-200 is-primary is-outlined has-text-weight-semibold is-size-6 has-text-primary" type="button">
                  View More
                </button>
              )}
            </div> */}
          </>
        ) : (
          <Table
            data={otherCollections}
            columns={[{ label: 'State' }, { label: 'Collection' }, { label: 'Description' }, { label: 'Source' }, { label: 'Author' }, { label: 'Snippets' }]}
            renderRow={(collection) => <CollectionRow data={collection} />}
          />
        )}
        {view === 'grid' && (
          <div className="">
            <Pagination
              currentPage={currentPage}
              totalCount={sortedCollections.filter((collection) => !collection.isActive).length}
              pageSize={pageSize}
              setPageSize={setPageSize}
              onPageChange={page => setCurrentPage(page)}
            />
          </div>)
        }
      </div>
    </div>
  );
}

export default CommentCollectionsList;
