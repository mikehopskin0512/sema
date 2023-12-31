import React from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import styles from './searchItem.module.scss';

const SearchItem = ({ item, keyword, isCollection }) => {
  const router = useRouter();
  const tags = item.tags?.slice(0,3);
  if (item.tags?.length > 3) {
    tags.push({ _id: '+', label: `+${item.tags.length}`});
  }
  const title = item.name || item.title;

  const highlightSubString = (substr) => {
    // Add \ to parenthesis and brackets to prevent Regex errors (parenthesis and brackets are reserved)
    const escapeRegex = keyword.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    //The gi modifier is used to do a case insensitive search of all occurrences of a regular expression in a string
    const re = new RegExp(`${escapeRegex}`, 'gi');
    return substr.replaceAll(re, `<strong>$&</strong>`);
  };

  const sourceName = item.source?.name || item.sourceName;

  const onClickHandler = async () => {
    await router.push(`/snippets?cid=${isCollection ? item._id : item.collectionId}`);
  };

  return (
    <div className={styles['search-item']} onClick={onClickHandler}>
      <div className="is-flex is-flex-direction-column">
        <div
          className={styles['search-item_title']}
          dangerouslySetInnerHTML={{__html: highlightSubString(title)}}
        />
        {item.source && (
          <div className={styles['search-item_source']}>
            <b>Source:</b> {sourceName}
          </div>
        )}
      </div>
      {tags && (
        <div className={clsx(styles['search-item_tags'], 'sema-tags')}>
          {tags.map((tag) => (
            <div
              className="sema-tag sema-is-rounded"
              key={tag.label}
            >{tag.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
};

export default SearchItem;
