import React from 'react';
import {
  POSITIVE, NEGATIVE, SELECTED, TOGGLE_OP,
} from './constants';

function TagsModal({ allTags, toggleTagSelection }) {
  const getTags = (isPositive) => {
    const label = isPositive ? POSITIVE : NEGATIVE;
    return allTags.map((tagObj, index) => {
      const tag = tagObj[label];
      const isSelected = tagObj[SELECTED] === label;
      const classes = `sema-tag sema-is-rounded ${
        index !== allTags.length - 1 ? 'sema-mb-4' : ''
      } ${isSelected ? 'sema-is-dark' : 'sema-is-light '}`;
      return (
        <span
          key={tag}
          className={classes}
          onClick={() => {
            toggleTagSelection({ tag, isSelected, op: TOGGLE_OP });
          }}
        >
          {tag}
        </span>
      );
    });
  };

  return (
    <div className="sema-columns sema-is-mobile">
      <div className="sema-column tagsContainer">{getTags(true)}</div>
      <div className="sema-column tagsContainer">{getTags(false)}</div>
    </div>
  );
}

export default TagsModal;
