import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import SearchItem from "../../components/globalSearch/searchItem";
import { useDispatch, useSelector } from "react-redux";
import { getUserSuggestedComments } from "../../state/features/comments/actions";
import clsx from "clsx";
import styles from './globalSearch.module.scss'
// TODO: turned off temporary / delete in 2022
// import { getEngGuides } from "../../state/features/engGuides/actions";
import useOutsideClick from '../../utils/useOutsideClick'

const isFieldIncludes = (searchTerm, fieldName) => {
  return function(searchItem) {
    const value = searchItem?.[fieldName].toLowerCase() || '';
    return value.includes(searchTerm.toLowerCase())
  }
}

const GlobalSearch = () => {
  const dispatch = useDispatch();
  // TODO: turned off temporary / delete in 2022
  // const { engGuides } = useSelector((state) => state.engGuidesState);
  const { user, token } = useSelector((state) => state.authState);
  const { collections: userCollections } = user
  const { suggestedComments } = useSelector((state) => state.commentsState);
  const [searchTerm, setSearchTerm] = useState('');

  const wrapper = useRef(null);
  // TODO: turned off temporary / delete in 2022
  // const engGuidesComments = useMemo(() => {
  //   const guideComments = engGuides.flatMap(({ collectionData }) => collectionData.comments);
  //   return searchTerm ? guideComments.filter(isFieldIncludes(searchTerm, 'title')) : guideComments;
  // },[engGuides, searchTerm]);
  // const engGuidesCollections = useMemo(() => {
  //   const collections = engGuides.map(({ collectionData }) => collectionData);
  //   return searchTerm ? collections.filter(isFieldIncludes(searchTerm, 'name')) : collections;
  // },[engGuides, searchTerm]);
  const suggestedCollections = useMemo(() => {
    const _collections = userCollections?.map(({ collectionData }) => collectionData);
    return searchTerm ? _collections?.filter(isFieldIncludes(searchTerm, 'name')) : _collections;
  },[userCollections, searchTerm]);

  const categories = [
    { title: "suggested snippets collections", items: suggestedCollections },
    { title: "suggested snippets", items: suggestedComments },
    // TODO: turned off temporary / delete in 2022
    // { title: "community engineering guide collections", items: engGuidesCollections },
    // { title: "community engineering guide", items: engGuidesComments },
  ]
  const onSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const clearSearch = () => setSearchTerm('');

  useOutsideClick(wrapper, clearSearch)

  useEffect(() => {
    const isAllCollections = true;
    dispatch(getUserSuggestedComments(searchTerm, user._id, token, isAllCollections));
  }, [searchTerm]);

  // TODO: turned off temporary / delete in 2022
  // useEffect(() => {
  //   if (!engGuides.length) {
  //     dispatch(getEngGuides(token));
  //   }
  // }, [dispatch, token]);

  return (
    <div className="is-flex is-relative" ref={wrapper}>
      <div className="control has-icons-left has-icons-right">
        <input
          onChange={onSearchInputChange}
          onKeyDown={e => e.keyCode === 27 && clearSearch()}
          value={searchTerm}
          className={clsx(styles['global-search_input'], "input has-background-white")}
          type="input"
          placeholder="Search Collections and Suggested Snippets"
        />
        <span className="icon is-small is-left">
          <FontAwesomeIcon icon={faSearch} />
        </span>
      </div>
      {searchTerm && (
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
