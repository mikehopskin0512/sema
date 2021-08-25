import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import SearchItem from "@/components/globalSearch/searchItem";
import { useDispatch, useSelector } from "react-redux";
import { getUserSuggestedComments } from "../../state/features/comments/actions";
import clsx from "clsx";
import styles from './globalSearch.module.scss'
import { getEngGuides } from "../../state/features/engGuides/actions";

const isCollectionNameIncludes = (searchTerm) => {
  return function({ collectionData }) {
    const collectionName = collectionData?.name.toLowerCase() || '';
    return collectionName.includes(searchTerm.toLowerCase())
  }
}

const CATEGORIES_TITLES = {
  COMMENTS_COLLECTIONS: 'suggested comment collections',
  COMMENTS: 'suggested comments',
  ENG_GUIDE_COLLECTIONS: 'community engineering guide collections',
  ENG_GUIDES: 'community engineering guide',
}

const GlobalSearch = () => {
  const dispatch = useDispatch();
  const { engGuides } = useSelector((state) => ({
    engGuides: state.engGuidesState.engGuides,
  }));
  const { user, token } = useSelector((state) => state.authState);
  const { comments } = useSelector((state) => state.commentsState);
  // const { collections } = user;
  const [searchTerm, setSearchTerm] = useState('');

  const engGuidesComments = useMemo(() => {
    return engGuides.flatMap(({ collectionData }) => collectionData.comments)
  },[engGuides])
  const engGuidesCollections = useMemo(() => {
    return engGuides.map(({ collectionData }) => collectionData)
  },[engGuides])
  console.log(comments);
  const searchItems = {
    [CATEGORIES_TITLES.COMMENTS_COLLECTIONS]: [],
    [CATEGORIES_TITLES.COMMENTS]: [],
    [CATEGORIES_TITLES.ENG_GUIDE_COLLECTIONS]: engGuidesCollections,
    [CATEGORIES_TITLES.ENG_GUIDES]: engGuidesComments,
  }

  useEffect(() => {
    if (!engGuides.length) {
      dispatch(getEngGuides(token));
    }
    if (!comments.length) {
      dispatch(getUserSuggestedComments(token));
    }
  }, [dispatch, token]);

  const onSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };


  return (
    <div className="is-flex is-relative">
      <div className="control has-icons-left has-icons-right">
        <input
          onChange={onSearchInputChange}
          value={searchTerm}
          className="input has-background-white"
          type="input"
          placeholder="Search Collections and Suggested Comments"
        />
        <span className="icon is-small is-left">
          <FontAwesomeIcon icon={faSearch} />
        </span>
      </div>
      {searchTerm && (
        <div className={clsx(styles['global-search'])}>
          {Object.keys(searchItems).map((category) => (
            <div className={styles['global-search_category']} key={category}>
              <div className={styles['global-search_category-title']}>
                {category}
              </div>
              {!searchItems[category].length && (
                <div className={styles['global-search_no-results']}>No results</div>
              )}
              {searchItems[category].map((item) => (
                <SearchItem item={item} key={item._id}/>
              ))}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default GlobalSearch;
