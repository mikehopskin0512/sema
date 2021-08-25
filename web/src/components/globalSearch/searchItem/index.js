import React from 'react';
import clsx from 'clsx';
import styles from './searchItem.module.scss';

const SearchItem = ({ item }) => {
  const tags = item.tags?.slice(0,3);
  if (item.tags?.length > 3) {
    tags.push({ _id: '+', label: `+${item.tags.length}`})
  }

  return (
    <div className={styles['search-item']}>
      <div className="is-flex is-flex-direction-column">
        <div className={styles['search-item_title']}>
          {item.name || item.title}
        </div>
        {item.source && (
          <div className={styles['search-item_source']}>
            <b>Source:</b> {item.source.name}
          </div>
        )}
      </div>
      {tags && (
        <div className={clsx(styles['search-item_tags'], 'sema-tags')}>
          {tags.map((tag) => (
            <div
              className="sema-tag sema-is-rounded"
              key={tag._id}
            >{tag.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
};

export default SearchItem;
