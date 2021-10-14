import React from 'react';
import clsx from 'clsx';
import styles from './searchItem.module.scss';

const SearchItem = ({ item, keyword }) => {
  const tags = item.tags?.slice(0,3);
  if (item.tags?.length > 3) {
    tags.push({ _id: '+', label: `+${item.tags.length}`})
  }
  const title = item.name || item.title

  const highlightSubString = (substr) => {
    const re = new RegExp(`${keyword}`, 'gi')
    return substr.replaceAll(re, `<strong>$&</strong>`)
  }
  const sourceName = item.source?.name || item.sourceName
  return (
    <div className={styles['search-item']}>
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
