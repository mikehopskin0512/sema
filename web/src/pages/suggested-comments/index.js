import React, { useState } from "react";
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import styles from './suggestedComments.module.scss';
import AddSuggestedCommentModal from '../../components/comment/addSuggestedCommentModal';
import CardList from '../../components/comment/cardList';
import CommentsViewButtons from '../../components/comment/commentsViewButtons';
import SuggestedCommentCollection from "../../components/comment/suggestedCommentCollections";
import withLayout from '../../components/layout';
import Helmet, { CommentCollectionsHelmet } from '../../components/utils/Helmet';
import GlobalSearch from '../../components/globalSearch';

const NUM_PER_PAGE = 9;

const isCollectionNameIncludes = (searchTerm) => {
  return function ({ collectionData }) {
    const collectionName = collectionData?.name.toLowerCase() || '';
    return collectionName.includes(searchTerm.toLowerCase())
  }
}

const CommentCollections = () => {
  const router = useRouter();
  const { query: { cid } } = router;
  const { user } = useSelector((state) => state.authState);
  const { collections } = user;

  const [page, setPage] = useState(1);
  const [collectionId, setCollectionId] = useState(null);
  const isNewCommentModalOpen = !!collectionId;
  const activeCollections = collections.filter((collection) => collection.isActive);
  const otherCollections = collections.filter((collection) => !collection.isActive);

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

  const clearSearchTerm = () => {
    setSearchTerm('')
  }

  const onSearchInputChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const renderCollections = () => {
    return (<div className={clsx('has-background-gray-9 hero', isNewCommentModalOpen ? styles['overflow-hidden'] : null)}>
      <Helmet {...CommentCollectionsHelmet} />
      <AddSuggestedCommentModal _id={collectionId} active={isNewCommentModalOpen} onClose={closeNewSuggestedCommentModal} />
      <div id="collectionBody" className={clsx('hero-body pb-250', isNewCommentModalOpen ? styles['overflow-hidden'] : null)}>
        <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap p-10">
          <p className="has-text-weight-semibold has-text-deep-black is-size-3">
            Suggested Comments
          </p>
          <GlobalSearch />
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
    </div>)
  }

  const renderSuggestedComments = () => {
    if (cid) {
      return <SuggestedCommentCollection collectionId={cid} />
    }
    return renderCollections()
  }

  return (
    <>
      {renderSuggestedComments()}
    </>
  );
};

export default withLayout(CommentCollections);
