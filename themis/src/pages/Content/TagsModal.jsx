import React from 'react';
import { POSITIVE, NEGATIVE, SELECTED, TOGGLE_OP } from './constants';

function TagsModal({ allTags, toggleTagSelection }) {
  const getTags = (isPositive) => {
    const label = isPositive ? POSITIVE : NEGATIVE;
    return allTags.map((tagObj) => {
      const tag = tagObj[label];
      const isSelected = tagObj[SELECTED] === label;
      const classes = `sema-tag sema-is-rounded sema-mb-4 ${
        isSelected ? 'sema-is-dark' : 'sema-is-light '
      }`;
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
      <div className="sema-column tagsPositiveContainer">{getTags(true)}</div>
      <div className="sema-column tagsNegativeContainer">{getTags(false)}</div>
    </div>
  );
}

export default TagsModal;
