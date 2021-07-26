import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { findIndex, flatten, isEmpty, uniqBy } from 'lodash';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import CommentFilter from '../../../components/comment/commentFilter';
import SuggestedCommentCard from '../../../components/comment/suggestedCommentCard';
import ContactUs from '../../../components/contactUs';
import withLayout from '../../../components/layout';
import SupportForm from '../../../components/supportForm';
import Helmet from '../../../components/utils/Helmet';

import { commentsOperations } from '../../../state/features/comments';

const { getCollectionById } = commentsOperations;

const NUM_PER_PAGE = 10;

const CollectionComments = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { auth, collectionState } = useSelector((state) => ({
    auth: state.authState,
    collectionState: state.commentsState,
  }));

  const { collectionId } = router.query;
  const { token, userVoiceToken } = auth;
  const { collection: { name, comments = [], _id } } = collectionState;

  const [supportForm, setSupportForm] = useState(false);
  const [page, setPage] = useState(1);
  const [commentsFiltered, setCommentsFiltered] = useState(comments);
  const [tagFilters, setTagFilters] = useState([]);
  const [languageFilters, setLanguageFilters] = useState([]);

  useEffect(() => {
    dispatch(getCollectionById(collectionId, token));
  }, [collectionId, dispatch, token]);

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

  const openSupportForm = () => setSupportForm(true);
  const closeSupportForm = () => setSupportForm(false);

  const viewMore = () => {
    setPage(page + 1);
  };

  const onSearch = ({ search, tag, language }) => {
    const filtered = comments.filter((item) => {
      const isMatchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.comment.toLowerCase().includes(search.toLowerCase()) ||
      item.author.toLowerCase().includes(search.toLowerCase()) ||
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
      <Helmet title={`Collection - ${name}`} />
      <SupportForm active={supportForm} closeForm={closeSupportForm} />
      <div className="hero-body">
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
        <div className="is-flex is-flex-wrap-wrap p-10 is-align-items-center">
          <p className="has-text-weight-semibold has-text-deep-black is-size-4 mr-10">
            {name}
          </p>
          <span className="tag is-rounded is-uppercase has-text-weight-semibold is-size-8 is-light">
            {comments.length} suggested comments
          </span>
        </div>
        <CommentFilter onSearch={onSearch} tags={tagFilters} languages={languageFilters} />
        { isEmpty(commentsFiltered) ?
          <div className="is-size-5 has-text-deep-black my-80 has-text-centered">No suggested comments found!</div> :
          commentsFiltered.slice(0, NUM_PER_PAGE * page).map((item) => (<SuggestedCommentCard data={item} key={item.displayId} />)) }
        {commentsFiltered.length > NUM_PER_PAGE && NUM_PER_PAGE * page < commentsFiltered.length && (
          <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-fullwidth mt-50 mb-30">
            <button
              onClick={viewMore}
              className="button has-background-gray-9 is-outlined has-text-weight-semibold is-size-6 is-primary"
              type="button">
              View More
            </button>
          </div>
        ) }
      </div>
      <ContactUs userVoiceToken={userVoiceToken} openSupportForm={openSupportForm} />
    </div>
  );
};

export default withLayout(CollectionComments);
