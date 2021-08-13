import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  findIndex, flatten, isEmpty, reverse, uniqBy,
} from 'lodash';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from '../collection.module.scss';

import AddSuggestedCommentModal from '../../../components/comment/addSuggestedCommentModal';
import CommentFilter from '../../../components/comment/commentFilter';
import SuggestedCommentCard from '../../../components/comment/suggestedCommentCard';
import withLayout from '../../../components/layout';
import Helmet from '../../../components/utils/Helmet';
import Toaster from '../../../components/toaster';

import { commentsOperations } from '../../../state/features/comments';
import { alertOperations } from '../../../state/features/alerts';

const { getCollectionById } = commentsOperations;
const { clearAlert } = alertOperations;

const NUM_PER_PAGE = 10;

const CollectionComments = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { alerts, auth, collectionState } = useSelector((state) => ({
    auth: state.authState,
    collectionState: state.commentsState,
    alerts: state.alertsState,
  }));

  const { collectionId } = router.query;
  const { token } = auth;
  const { collection: { name = '', comments = [], _id } } = collectionState;
  const { showAlert, alertType, alertLabel } = alerts;

  const [page, setPage] = useState(1);
  const [commentsFiltered, setCommentsFiltered] = useState(comments);
  const [tagFilters, setTagFilters] = useState([]);
  const [languageFilters, setLanguageFilters] = useState([]);
  const [newCommentModalOpen, setNewCommentModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getCollectionById(collectionId, token));
  }, [collectionId, dispatch, token]);

  useEffect(() => {
    if (showAlert === true) {
      dispatch(clearAlert());
    }
  }, [showAlert, dispatch]);

  useEffect(() => {
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

  const openNewSuggestedCommentModal = () => setNewCommentModalOpen(true);
  const closeNewSuggestedCommentModal = () => setNewCommentModalOpen(false);

  const viewMore = () => {
    setPage(page + 1);
  };

  const onSearch = ({ search, tag, language }) => {
    const filtered = comments.filter((item) => {
      const isMatchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.comment.toLowerCase().includes(search.toLowerCase()) ||
      item.source.name.toLowerCase().includes(search.toLowerCase());
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
  };

  useEffect(() => {
    const body = document.querySelector('body');
    if (newCommentModalOpen) {
      body.classList.add('has-no-horizontal-scroll');
    } else {
      body.classList.remove('has-no-horizontal-scroll');
    }
  }, [newCommentModalOpen]);

  return (
    <div className={clsx('has-background-gray-9 hero', newCommentModalOpen ? styles['overflow-hidden'] : null)}>
      <Helmet title={`Collection - ${name}`} />
      <Toaster type={alertType} message={alertLabel} showAlert={showAlert} />
      <AddSuggestedCommentModal active={newCommentModalOpen} onClose={closeNewSuggestedCommentModal} />
      <div className="hero-body pb-250">
        <div className="is-flex is-align-items-center px-10 mb-15">
          <a href="/collections" className="is-hidden-mobile">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-10" color="#000" />
          </a>
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li><a href="/collections" className="has-text-grey">Comment Library</a></li>
              <li className="is-active has-text-weight-semibold"><a href={`/collections/${_id}`}>{name}</a></li>
            </ul>
          </nav>
        </div>
        <div className="is-flex is-flex-wrap-wrap is-align-items-center is-justify-content-space-between">
          <div className="is-flex is-align-items-center p-10">
            <p className="has-text-weight-semibold has-text-deep-black is-size-4 mr-10">
              {name}
            </p>
            <span className="tag is-rounded is-uppercase has-text-weight-semibold is-size-8 is-light">
              {comments.length} suggested comments
            </span>
          </div>
          {name.toLowerCase() === 'my comments' || name.toLowerCase() === 'custom comments' ? (
            <button
              className="button is-small is-primary border-radius-4px"
              type="button"
              onClick={openNewSuggestedCommentModal}>
              Add New Comment
            </button>
          ) : null}
        </div>
        <CommentFilter onSearch={onSearch} tags={tagFilters} languages={languageFilters} />
        { isEmpty(commentsFiltered) ?
          <div className="is-size-5 has-text-deep-black my-80 has-text-centered">No suggested comments found!</div> :
          reverse(commentsFiltered).slice(0, NUM_PER_PAGE * page).map((item) => (<SuggestedCommentCard data={item} key={item.displayId} />)) }
        {commentsFiltered.length > NUM_PER_PAGE && NUM_PER_PAGE * page < commentsFiltered.length && (
          <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-fullwidth mt-50 mb-70">
            <button
              onClick={viewMore}
              className="button has-background-gray-9 is-outlined has-text-weight-semibold is-size-6 is-primary"
              type="button">
              View More
            </button>
          </div>
        ) }
      </div>
    </div>
  );
};

export default withLayout(CollectionComments);
