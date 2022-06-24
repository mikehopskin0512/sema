import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  findIndex, flatten, isEmpty, uniqBy,
} from 'lodash';
import PropTypes from 'prop-types';
import { ArrowLeftIcon, PlusIcon } from '../../Icons';
import { useRouter } from 'next/router';
import styles from './suggestedCommentCollections.module.scss';
import CommentFilter from '../commentFilter';
import SuggestedCommentCard from '../suggestedCommentCard';
import ActionGroup from '../actionGroup';
import Helmet from '../../utils/Helmet';
import Toaster from '../../toaster';
import Loader from '../../Loader';
import { DEFAULT_COLLECTION_NAME, PATHS, SEMA_CORPORATE_ORGANIZATION_ID } from '../../../utils/constants';

import { commentsOperations } from '../../../state/features/comments';
import { alertOperations } from '../../../state/features/alerts';
import usePermission from '../../../hooks/usePermission';
import useAuthEffect from '../../../hooks/useAuthEffect';
import {isSemaDefaultCollection, isOrganizationDefaultCollection} from '../../../utils';
import { black950 } from '../../../../styles/_colors.module.scss';

const { getCollectionById } = commentsOperations;
const { clearAlert } = alertOperations;

const NUM_PER_PAGE = 10;

const SuggestedCommentCollection = ({ collectionId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { alerts, auth, collectionState } = useSelector((state) => ({
    auth: state.authState,
    collectionState: state.commentsState,
    alerts: state.alertsState,
  }));

  const { token, user, selectedOrganization } = auth;
  const { collection: { name = '', comments = [], _id,  }, isFetching } = collectionState;
  const { showAlert, alertType, alertLabel } = alerts;

  const [page, setPage] = useState(1);
  const [commentsFiltered, setCommentsFiltered] = useState(comments);
  const [tagFilters, setTagFilters] = useState([]);
  const [languageFilters, setLanguageFilters] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
  const { checkAccess, checkOrganizationPermission } = usePermission();
  const [isParsing, setIsParsing] = useState(true);

  useAuthEffect(() => {
    dispatch(getCollectionById(collectionId, token));
  }, [collectionId]);

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  useEffect(() => {
    setIsParsing(false);
  }, [commentsFiltered]);

  useEffect(() => {
    setIsParsing(true);
    setCommentsFiltered(comments);
    const commentTags = uniqBy(flatten(comments.map((item) => item.tags.map((tag) => tag))), 'label');
    const tags = [];
    const languages = [];
    commentTags.forEach((item) => {
      if (item.type === 'language') {
        languages.push(item);
      }
      if (item.type === 'guide' || item.type === 'custom') {
        tags.push(item);
      }
    });
    setTagFilters(tags);
    setLanguageFilters(languages);
  }, [comments]);

  const viewMore = () => {
    setPage(page + 1);
  };

  const goToAddPage = async () => {
    await router.push(`${PATHS.SNIPPETS.ADD}?cid=${collectionId}`);
  };

  const onSearch = ({ search, tag, language }) => {
    setIsParsing(true);
    const filtered = comments.filter((item) => {
      const isMatchSearch = item?.title?.toLowerCase?.().includes(search.toLowerCase()) ||
      item?.comment?.toLowerCase?.().includes(search.toLowerCase()) ||
      item?.source?.name?.toLowerCase?.().includes(search.toLowerCase());
      const tagIndex = findIndex(item.tags, { label: tag });
      const languageIndex = findIndex(item.tags, { label: language });
      let filterBool = true;
      if (!isEmpty(search)) {
        filterBool = filterBool && isMatchSearch;
      }
      if (!isEmpty(tag)) {
        filterBool = filterBool && tagIndex !== -1;
      }
      if (!isEmpty(language)) {
        filterBool = filterBool && languageIndex !== -1;
      }
      return filterBool;
    });
    setCommentsFiltered([...filtered]);
    setIsParsing(false);
  };
  const isAddCommentActive = name.toLowerCase() === DEFAULT_COLLECTION_NAME || name.toLowerCase() === 'custom snippets';

  const handleSelectChange = (commentId, value) => {
    if (value) {
      setSelectedComments([...selectedComments, commentId]);
    } else {
      setSelectedComments(selectedComments.filter((item) => item !== commentId));
    }
  };

  const handleSelectAllChange = (value) => {
    setSelectedComments(value ? commentsFiltered.map((c) => c._id) : []);
  };

  const archiveComments = useMemo(() => commentsFiltered.filter((item) => selectedComments
    .indexOf(item._id) !== -1 && !item.isActive), [selectedComments, commentsFiltered]);

  const unarchiveComments = useMemo(() => commentsFiltered.filter((item) => selectedComments
    .indexOf(item._id) !== -1 && item.isActive), [selectedComments, commentsFiltered]);

  const canCreate = useMemo(() => checkOrganizationPermission('canCreateSnippets') || isSemaDefaultCollection(name) || isOrganizationDefaultCollection(selectedOrganization, { name }), [user, name]);
  const canEdit = useMemo(() => checkOrganizationPermission('canEditSnippets') || isSemaDefaultCollection(name) || isOrganizationDefaultCollection(selectedOrganization, { name }), [user, name]);

  return (
    <div>
      <Helmet title={`Collection - ${name}`} />
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
      <div>
        <div className="is-flex is-align-items-center px-10 mb-15">
          <a href={PATHS.SNIPPETS._} className="is-hidden-mobile mr-8 is-flex">
            <ArrowLeftIcon color={black950} size="small" />
          </a>
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li><a href={PATHS.SNIPPETS._} className="has-text-grey">Snippets</a></li>
              <li className="is-active has-text-weight-semibold"><a>{isFetching ? '' : name}</a></li>
            </ul>
          </nav>
        </div>
        <div className="is-flex is-flex-wrap-wrap is-align-items-center is-justify-content-space-between">
          <div className="is-flex is-align-items-center p-10">
            <p className="has-text-weight-semibold has-text-black-950 is-size-4 mr-10">
              {isFetching ? '' : name}
            </p>
            <span className="tag is-rounded is-uppercase has-text-weight-semibold is-size-8 is-light">
              {isFetching ? '' : `${comments.length} snippets`}
            </span>
          </div>
          {
            !isFetching && canCreate && (
              <button
                className="button is-small is-primary border-radius-4px"
                type="button"
                onClick={goToAddPage}>
                <PlusIcon size="small" />
                <span className="ml-8">
                  Add New Snippet
                </span>
              </button>
            )
          }
        </div>
        {
          canEdit && selectedComments.length ? (
            <ActionGroup
              selectedComments={selectedComments}
              handleSelectAllChange={handleSelectAllChange}
              archiveComments={archiveComments}
              unarchiveComments={unarchiveComments}
              collectionId={collectionId}
            />
          ) : (
            <CommentFilter onSearch={onSearch} tags={tagFilters} languages={languageFilters} />
          )
        }
        {
          isParsing || isFetching ? (
            <div className="is-flex is-align-items-center is-justify-content-center" style={{ height: '30vh' }}>
              <Loader/>
            </div>
          ) : isEmpty(commentsFiltered) ? (
            <div className="is-size-5 has-text-black-950 my-120 has-text-centered">
              <img src="/img/empty-page.svg" className={styles['no-comments-img']} />
              <p className="is-size-7 my-25">You don't have any Custom Snippets.</p>
              { canCreate && (
                <button
                  className="button is-small is-primary border-radius-4px has-text-semibold"
                  type="button"
                  onClick={goToAddPage}>
                  <PlusIcon size="small" />
                  <span className="ml-8">
                    Add New Snippet
                  </span>
                </button>
              ) }
            </div>
          ) : (
            commentsFiltered.slice(0, NUM_PER_PAGE * page).map((item, index) => (
              <SuggestedCommentCard
                data={item}
                key={item._id || index}
                collectionId={collectionId}
                selected={!!selectedComments.find((g) => g === item._id)}
                onSelectChange={handleSelectChange}
                isEditable={canEdit}
              />
            ))
          )
        }
        {commentsFiltered.length > NUM_PER_PAGE && NUM_PER_PAGE * page < commentsFiltered.length && (
          <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-fullwidth mt-50 mb-70">
            <button
              onClick={viewMore}
              className="button has-background-gray-200 is-outlined has-text-weight-semibold is-size-6 is-primary has-text-primary"
              type="button">
              View More
            </button>
          </div>
        ) }
      </div>
    </div>
  );
};

SuggestedCommentCollection.propTypes = {
  collectionId: PropTypes.string.isRequired,
};

export default SuggestedCommentCollection;
