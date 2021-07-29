import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { isEmpty } from 'lodash';
import CardList from '../../components/comment/cardList';
import CommentsViewButtons from '../../components/comment/commentsViewButtons';
import withLayout from '../../components/layout';
import Helmet, { CommentCollectionsHelmet } from '../../components/utils/Helmet';

const NUM_PER_PAGE = 9;

const CommentCollections = () => {
  const { user } = useSelector((state) => state.authState);
  const { collections: collectionsState } = user;

  const [collections, setCollections] = useState(collectionsState);
  const [collectionsArrs, setCollectionsArrs] = useState({
    activeCollections: [],
    otherCollections: [],
  });
  const [page, setPage] = useState(1);
  const {
    register, handleSubmit, reset, getValues,
  } = useForm();

  useEffect(() => {
    setCollections(collectionsState);
  }, [collectionsState]);

  useEffect(() => {
    if (collections && collections.length) {
      const activeCollections = collections.filter((collection) => collection.isActive);
      const otherCollections = collections.filter((collection) => !collection.isActive);
      setCollectionsArrs({
        activeCollections: [...activeCollections],
        otherCollections: [...otherCollections],
      });
    } else {
      setCollectionsArrs({
        activeCollections: [],
        otherCollections: [],
      });
    }
  }, [collections, collectionsState]);

  const viewMore = () => {
    setPage(page + 1);
  };

  const onSearch = ({ search }) => {
    const filtered = collectionsState.filter((item) => item.collectionData.name.toLowerCase().includes(search.toLowerCase()));
    setCollections([...filtered]);
  };

  const onClear = () => {
    reset();
    setCollections(collectionsState);
  };

  return (
    <div className="has-background-gray-9 hero">
      <Helmet {...CommentCollectionsHelmet} />
      <div className="hero-body">
        <div className="is-flex is-justify-content-space-between is-flex-wrap-wrap p-10">
          <p className="has-text-weight-semibold has-text-deep-black is-size-4">
            Active Comment Collections
          </p>
          <div className="is-flex is-flex-wrap-wrap">
            <form className="mr-25 my-5" onSubmit={handleSubmit(onSearch)}>
              <div className="control has-icons-left has-icons-right">
                <input
                  className="input is-small has-background-white"
                  type="input"
                  placeholder="Search comment collections"
                  {
                    ...register('search')
                  }
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
              </div>
              {!isEmpty(getValues('search')) && (
                <button
                  className="button is-text has p-0 is-absolute is-size-8 has-text-primary"
                  type="button"
                  onClick={onClear}
                >
                  Clear Search
                </button>
              )}
            </form>
            <CommentsViewButtons />
          </div>
        </div>
        <p className="is-size-6 has-text-deep-black my-10 px-10">
          These are the Comments that will be suggested as you create code reviews. Turn off to move them to other collections.
        </p>
        <CardList collections={collectionsArrs.activeCollections || []} />
        <p className="has-text-weight-semibold has-text-deep-black is-size-4 mt-60 p-10">Other Comment Collections</p>
        <CardList collections={collectionsArrs.otherCollections.slice(0, NUM_PER_PAGE * page) || []} />
        <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center is-fullwidth my-50">
          {collectionsArrs.otherCollections.length > NUM_PER_PAGE && NUM_PER_PAGE * page < collectionsArrs.otherCollections.length && (
            <button onClick={viewMore} className="button has-background-gray-9 is-primary is-outlined has-text-weight-semibold is-size-6" type="button">
              View More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default withLayout(CommentCollections);
