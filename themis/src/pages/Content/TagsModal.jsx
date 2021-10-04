import React from 'react';
import {
  POSITIVE, NEGATIVE, TOGGLE_OP,
} from './constants';

function TagsModal({ allTags, toggleTagSelection }) {
  const Tag = ({ tag, type }) => {
    const isSelected = tag.selected === type;
    const toggleTag = () => {
      toggleTagSelection({
        tag: tag[type],
        isSelected,
        op: TOGGLE_OP,
      });
    };
    return (
      <div
        className={`
          sema-tag 
          sema-is-rounded 
          ${isSelected ? 'sema-is-dark' : 'sema-is-light'}
        `}
        style={{ cursor: 'pointer' }}
        onClick={toggleTag}
      >
        {tag[type]}
      </div>
    );
  };

  return (
    <div className="tags-modal">
      <div className="tags-modal--column sema-is-align-items-flex-end">
        {allTags.map((tag) => <Tag tag={tag} type={POSITIVE} key={tag[POSITIVE]} />)}
      </div>
      <div className="tags-modal--column">
        {allTags.map((tag) => <div className="tags-modal--separator" key={`separator-${tag[POSITIVE]}`} />)}
      </div>
      <div className="tags-modal--column">
        {allTags.map((tag) => <Tag tag={tag} type={NEGATIVE} key={tag[NEGATIVE]} />)}
      </div>
    </div>
  );
}

export default TagsModal;
