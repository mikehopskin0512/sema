import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { findIndex, flatten, isEmpty, uniqBy } from 'lodash';
import CommentFilter from '../../components/comment/commentFilter';
import CommentsViewButtons from '../../components/comment/commentsViewButtons';
import SuggestedCommentCard from '../../components/comment/suggestedCommentCard';
import withLayout from '../../components/layout';
import Helmet, { SuggestedCommentsHelmet } from '../../components/utils/Helmet';

import { commentsOperations } from '../../state/features/comments';

const { getUserCollections } = commentsOperations;

const NUM_PER_PAGE = 10;

const SuggestedComments = () => {
  const dispatch = useDispatch();
  const { auth, commentsState } = useSelector((state) => ({
    auth: state.authState,
    commentsState: state.commentsState,
  }));
  const { token } = auth;
  const { comments = [] } = commentsState;

  useEffect(() => {
    dispatch(getUserCollections(token));
  }, [dispatch, token]);

  const [page, setPage] = useState(1);
  const [commentsFiltered, setCommentsFiltered] = useState(comments);
  const [tagFilters, setTagFilters] = useState([]);
  const [languageFilters, setLanguageFilters] = useState([]);

  useEffect(() => {
    setCommentsFiltered(comments);
    const commentTags = uniqBy(flatten(comments.map((item) => item.tags.map((tag) => tag))), 'label');
    const tags = [];
    const languages = [];
    commentTags.forEach((item) => {
      if (item.type === 'language') {
        languages.push(item);
      }
      if (item.type === 'guide') {
        tags.push(item);
      }
    });
    setTagFilters(tags);
    setLanguageFilters(languages);
  }, [comments]);

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

  return (
    <div className="has-background-gray-9 hero">
      <Helmet {...SuggestedCommentsHelmet} />
      <div className="hero-body">
        <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap p-10">
          <p className="has-text-weight-semibold has-text-deep-black is-size-4">
            Suggested Comments
          </p>
          <CommentsViewButtons />
        </div>
        <CommentFilter onSearch={onSearch} tags={tagFilters} languages={languageFilters} />
        { isEmpty(commentsFiltered) ?
          <div className="is-size-5 has-text-deep-black my-80 has-text-centered">No suggested comments found!</div> :
          commentsFiltered.slice(0, NUM_PER_PAGE * page).map((item) => (<SuggestedCommentCard data={item} key={item.displayId} />)) }
        {commentsFiltered.length > NUM_PER_PAGE && NUM_PER_PAGE * page < commentsFiltered.length && (
          <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-fullwidth mt-50 mb-30">
            <button
              onClick={viewMore}
              className="button has-background-gray-9 is-outlined has-text-weight-semibold is-size-6 is-primary has-text-primary"
              type="button">
              View More
            </button>
          </div>
        ) }
      </div>
    </div>
  );
};

export default withLayout(SuggestedComments);
