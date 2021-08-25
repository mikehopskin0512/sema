import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import SearchItem from "@/components/globalSearch/searchItem";
import { useDispatch, useSelector } from "react-redux";
import { getUserSuggestedComments } from "../../state/features/comments/actions";
import clsx from "clsx";
import styles from './globalSearch.module.scss'
import { getEngGuides } from "../../state/features/engGuides/actions";

const isFieldIncludes = (searchTerm, fieldName) => {
  return function(searchItem) {
    const value = searchItem?.[fieldName].toLowerCase() || '';
    return value.includes(searchTerm.toLowerCase())
  }
}

const GlobalSearch = () => {
  const dispatch = useDispatch();
  const { engGuides } = useSelector((state) => state.engGuidesState);
  const { token } = useSelector((state) => state.authState);
  const { comments } = useSelector((state) => state.commentsState);
  const [searchTerm, setSearchTerm] = useState('');

  console.log(comments);

  const engGuidesComments = useMemo(() => {
    const comments = engGuides.flatMap(({ collectionData }) => collectionData.comments)
    return searchTerm ? comments.filter(isFieldIncludes(searchTerm, 'title')) : comments
  },[engGuides, searchTerm])
  const engGuidesCollections = useMemo(() => {
    const collections = engGuides.map(({ collectionData }) => collectionData)
    return searchTerm ? collections.filter(isFieldIncludes(searchTerm, 'name')) : collections
  },[engGuides, searchTerm])
  const suggestedCollections = useMemo(() => {
    const comments = comments.map(({ collectionData }) => collectionData)
    return searchTerm ? comments.filter(isFieldIncludes(searchTerm, 'name')) : comments
  },[engGuides, searchTerm])
  const suggestedComments = useMemo(() => {
    const comments = comments.map(({ collectionData }) => collectionData)
    return searchTerm ? comments.filter(isFieldIncludes(searchTerm, 'name')) : comments
  },[engGuides, searchTerm])

  const categories = [
    { title: "suggested comment collections", items: suggestedCollections },
    { title: "suggested comments", items: suggestedComments },
    { title: "community engineering guide collections", items: engGuidesCollections },
    { title: "community engineering guide", items: engGuidesComments },
  ]

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
          className={clsx(styles['global-search_input'], "input has-background-white")}
          type="input"
          placeholder="Search Collections and Suggested Comments"
        />
        <span className="icon is-small is-left">
          <FontAwesomeIcon icon={faSearch} />
        </span>
      </div>
      {searchTerm && (
        <div className={clsx(styles['global-search'])}>
          {categories.map((category) => (
            <div className={styles['global-search_category']} key={category}>
              <div className={styles['global-search_category-title']}>
                {category.title}
              </div>
              {!category.items.length && (
                <div className={styles['global-search_no-results']}>No results</div>
              )}
              {category.items.map((item) => (
                <SearchItem item={item} key={item._id} keyword={searchTerm}/>
              ))}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default GlobalSearch;
