import { PlusIcon } from '../../Icons';
import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import CollectionRow from './CollectionRow';
import CardList from '../cardList';
import SnippetCollectionFilter from '../snippetCollectionFilter';
import Helmet, { SnippetCollectionsHelmet } from '../../utils/Helmet';
import Loader from '../../Loader';
import Toaster from '../../toaster';
import Table from '../../labels-management/LabelsTable';
import {
  DEFAULT_COLLECTION_NAME,
  PATHS,
  SEMA_CORPORATE_TEAM_ID,
  SEMA_COLLECTIONS_VIEW_MODE,
  NUM_PER_PAGE,
  PROFILE_VIEW_MODE,
  COLLECTION_TYPE
} from '../../../utils/constants';
import { collectionsOperations } from "../../../state/features/collections";
import { alertOperations } from '../../../state/features/alerts';
import usePermission from '../../../hooks/usePermission';
import { ListIcon, GridIcon } from '../../../components/Icons';
import Pagination from '../../../components/pagination';
import { commentsOperations } from '../../../state/features/comments';
import styles from './commentCollectionsList.module.scss';
import { isEmpty, range, uniqBy } from 'lodash';
import { fetchTeamCollections } from "../../../state/features/teams/actions";
import RepoSkeleton from '../../../components/skeletons/repoSkeleton';
import SnippetsHeaderSkeleton from '../../../components/skeletons/snippetsHeaderSkeleton';

const { clearAlert } = alertOperations;
const { fetchAllUserCollections } = collectionsOperations;
const { getCollectionById } = commentsOperations;

const CommentCollectionsList = () => {
  const dispatch = useDispatch();
  const { checkAccess, isSemaAdmin } = usePermission();
  const { auth, collectionsState, alerts, teamsState } = useSelector((state) => ({
    auth: state.authState,
    collectionsState: state.collectionsState,
    alerts: state.alertsState,
    teamsState: state.teamsState
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
  const { token, profileViewMode, selectedTeam } = auth;
  const { teamCollections } = teamsState;

  const { data = [], isFetching } = collectionsState;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(NUM_PER_PAGE);

  const canCreate = checkAccess(SEMA_CORPORATE_TEAM_ID, 'canCreateCollections');

  const setDefaultCollectionAsActive = () => {
    const collection = data.find((collection) => collection?.collectionData?.name?.toLowerCase() === DEFAULT_COLLECTION_NAME);
    if(collection?.collectionData?._id) {
      dispatch(getCollectionById(collection.collectionData._id, token));
    }
  };

  const sortedCollections = useMemo(() => {
    let collections = profileViewMode === PROFILE_VIEW_MODE.TEAM_VIEW ? [...teamCollections] : [...data];
    if (!isSemaAdmin()) {
      collections = collections.filter((collection) => collection?.collectionData?.isActive);
    }
    collections = collections.filter((item) => {
      if (item.collectionData) {
        const labelsIndex = item?.collectionData.guides ? filter.labels?.findIndex((tag) => item.collectionData.guides.findIndex((commentTag) => commentTag.toLowerCase() === tag.label.toLowerCase()) !== -1) : -1;
        const languagesIndex = item?.collectionData.languages ? filter.languages?.findIndex((tag) => item.collectionData.languages.findIndex((commentTag) => commentTag.toLowerCase() === tag.label.toLowerCase()) !== -1) : -1;
        const sourcesIndex = item?.collectionData.source ? filter.sources?.findIndex(({ value }) => value === item?.collectionData.source) : -1;
        const authorsIndex = item?.collectionData.author ? filter.authors?.findIndex((author) => author.value.toLowerCase() === item.collectionData.author.toLowerCase()) : -1;
        const statusIndex = (typeof item?.isActive === 'boolean') ? filter.status?.findIndex((status) => status.value === item.collectionData.isActive) : -1;

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
        if (!isEmpty(selectedTeam)) {
          filterBool = filterBool && (item?.collectionData?.name?.toLowerCase() !== DEFAULT_COLLECTION_NAME)
        }
        return filterBool;
      }
      return true;
    }).sort((_a, _b) => {
      const a = _a.collectionData?.name.toLowerCase();
      const b = _b.collectionData?.name.toLowerCase();
      if (a === DEFAULT_COLLECTION_NAME || _a.collectionData.type === COLLECTION_TYPE.TEAM) return -1;
      if (b === DEFAULT_COLLECTION_NAME || _b.collectionData.type === COLLECTION_TYPE.TEAM) return 1;
      return a >= b ? 1 : -1;
    });
    return uniqBy(collections, 'collectionData._id');
  }, [data, teamCollections, filter, selectedTeam]);

  const paginatedInactiveCollections = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + parseInt(pageSize, 10);
    // PUT OTHER FILTERS HERE
    const filteredCollections = sortedCollections.filter((collection) => !collection.isActive).slice(firstPageIndex, lastPageIndex);
    return filteredCollections;
  }, [currentPage, pageSize, isFetching, filter, sortedCollections, data, teamCollections]);

  const activeCollections = sortedCollections.filter((collection) => collection.isActive);

  const inactiveCollections = sortedCollections.filter((collection) => !collection.isActive);

  useEffect(() => {
    if (profileViewMode === PROFILE_VIEW_MODE.TEAM_VIEW && selectedTeam?.team?._id) {
      dispatch(fetchTeamCollections(selectedTeam?.team?._id, token));
    } else {
      dispatch(fetchAllUserCollections(token));
    }

    const viewMode = localStorage.getItem(SEMA_COLLECTIONS_VIEW_MODE);

    if (viewMode) {
      setView(viewMode);
    }
  }, [selectedTeam]);

  useEffect(() => {
    if (isEmpty(selectedTeam) && data) {
      setDefaultCollectionAsActive();
    }
  }, [data, teamCollections]);

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  const changeView = (value) => {
    setView(value);
    localStorage.setItem(SEMA_COLLECTIONS_VIEW_MODE, value);
  }

  const isLoaderNeeded = isEmpty(selectedTeam) ?
    isFetching :
    !teamCollections.length && teamsState.isFetching;

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
              <button className={clsx("button border-radius-0 is-small", view === 'list' ? 'is-primary' : '')} onClick={() => changeView('list')}>
                <ListIcon />
              </button>
              <button className={clsx("button border-radius-0 is-small", view === 'grid' ? 'is-primary' : '')} onClick={() => changeView('grid')}>
                <GridIcon />
              </button>
            </div>
          </div>
        </div>
        <div className="px-10">
          <SnippetCollectionFilter
            setFilter={setFilter}
            filter={filter}
            collections={sortedCollections}
          />
        </div>
        {isLoaderNeeded ? <div className={styles['snippet-title-skeleton']}><SnippetsHeaderSkeleton /></div> : (
          <>
            <p className="has-text-weight-semibold has-text-black-950 is-size-4 p-10">Active Collections ({activeCollections.length})</p>
            <p className="is-size-6 has-text-black-950 mb-15 px-10">
              Snippets from these collections will be suggested as you create code reviews
            </p>
          </>
        )}
        {isLoaderNeeded && (
          <>
            <div className="is-flex is-justify-content-flex-start is-flex-wrap-wrap">
              {range(9).map(_ => (
                <div className={clsx('p-10 is-flex is-clickable', styles['card-wrapper'])} aria-hidden="true">
                  <div className={styles['snippet-card-wrapper']}>
                    <RepoSkeleton />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {view === 'grid' && !isLoaderNeeded ? (
          <CardList collections={activeCollections || []} />
        ) : (
          <Table
            data={activeCollections}
            columns={[{ label: 'State' }, { label: 'Collection' }, { label: 'Description' }, { label: 'Source' }, { label: 'Author' }, { label: 'Snippets', textAlign: 'center' }, { label: 'Status' }]}
            renderRow={(collection) => <CollectionRow data={collection} />}
            pagination={false}
            className={clsx("px-10", styles['overflow-unset'])}
            emptyMessage="No results"
          />
        )}
        <p className="has-text-weight-semibold has-text-black-950 is-size-4 mt-60 p-10">Other Collections ({inactiveCollections.length})</p>
        {view === 'grid' && !isLoaderNeeded ? (
          <>
            <CardList type="others" collections={paginatedInactiveCollections.slice(0, pageSize * currentPage) || []} />
          </>
        ) : (
          <Table
            data={paginatedInactiveCollections}
            columns={[{ label: 'State' }, { label: 'Collection' }, { label: 'Description' }, { label: 'Source' }, { label: 'Author' }, { label: 'Snippets', textAlign: 'center' }, { label: 'Status' }]}
            renderRow={(collection) => <CollectionRow data={collection} />}
            pagination={false}
            className={clsx("px-10", styles['overflow-unset'])}
            emptyMessage="No results"
          />
        )}
        <div className="mt-25 px-10">
          <Pagination
            currentPage={currentPage}
            totalCount={sortedCollections.filter((collection) => !collection.isActive).length}
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
