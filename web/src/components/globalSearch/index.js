import React, { useEffect, useMemo, useRef, useState } from 'react';
import SearchItem from "../../components/globalSearch/searchItem";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from '../../hooks/useDebounce';
import { getUserSuggestedComments } from "../../state/features/comments/actions";
import clsx from "clsx";
import { SearchIcon } from '../Icons';
import styles from './globalSearch.module.scss';
import useOutsideClick from '../../utils/useOutsideClick';
import { SEARCH_CATEGORY_TITLES } from '../../utils/constants';
import { isSuggestedCollectionTitle } from '../../utils';

const isFieldIncludes = (searchTerm, fieldName) => {
  return function(searchItem) {
    const value = searchItem?.[fieldName].toLowerCase() || '';
    return value.includes(searchTerm.toLowerCase())
  }
}

const GlobalSearch = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.authState);
  const { collections: userCollections } = user
  const { suggestedComments } = useSelector((state) => state.commentsState);
  const [searchTerm, setSearchTerm] = useState('');
  const searchTermDebounced = useDebounce(searchTerm, 600);
  const wrapper = useRef(null);
  const suggestedCollections = useMemo(() => {
    const _collections = userCollections?.map(({ collectionData }) => collectionData);
    return searchTerm ? _collections?.filter(isFieldIncludes(searchTerm, 'name')) : _collections;
  },[userCollections, searchTerm]);
  const categories = [
    { title: SEARCH_CATEGORY_TITLES.COLLECTIONS, items: suggestedCollections },
    { title: SEARCH_CATEGORY_TITLES.SNIPPETS, items: suggestedComments },
  ]
  const onSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const clearSearch = () => setSearchTerm('');

  useOutsideClick(wrapper, clearSearch)

  const isSearchTermSufficient = searchTerm.trim().length > 1;
  useEffect(() => {
    if (isSearchTermSufficient) {
      const isAllCollections = true;
      dispatch(getUserSuggestedComments(searchTermDebounced, user._id, token, isAllCollections));
    }
  }, [searchTermDebounced]);

  return (
    <div className="is-flex is-relative" ref={wrapper}>
      <div className="control has-icons-left has-icons-right">
        <input
          onChange={onSearchInputChange}
          onKeyDown={e => e.keyCode === 27 && clearSearch()}
          value={searchTerm}
          className={clsx(styles['global-search_input'], "input has-background-white")}
          type="input"
          {/* TODO: move it back after EAST-1252 */}
          // placeholder="Search Collections and Snippets"
          placeholder="Search Collections"
        />
        <span className="icon is-small is-left">
          <SearchIcon size="small" />
        </span>
      </div>
      {isSearchTermSufficient && (
        <div className={clsx(styles['global-search'])}>
          {categories.map((category) => (
            <div className={styles['global-search_category']} key={category.title}>
              <div className={styles['global-search_category-title']}>
                {category.title}
              </div>
              {!category.items.length && (
                <div className={styles['global-search_no-results']}>No results</div>
              )}
              {category.items.map((item) => (
                <SearchItem
                  isCollection={isSuggestedCollectionTitle(category.title)}
                  key={item._id}
                  keyword={searchTerm}
                  item={item}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
