import React from 'react';
import {
  POSITIVE, NEGATIVE, TOGGLE_OP,
} from './constants';

function TagsModal({ allTags, toggleTagSelection }) {
  const Tag = ({ tag, type }) => {
    const isSelected = tag.selected === type;
    return (
      <div
        className={`
          sema-tag 
          sema-is-rounded 
          ${isSelected ? 'sema-is-dark' : 'sema-is-light'}
        `}
        style={{ cursor: 'pointer' }}
        onClick={() => {
          toggleTagSelection({
            tag,
            isSelected,
            op: TOGGLE_OP,
          });
        }}
      >
        {tag[type]}
      </div>
    );
  };

  return (
    <div className="tags-modal">
      <div className="tags-modal--column sema-is-align-items-flex-end">
        <Tag tag={allTags[0]} type={POSITIVE} key={1} />
        {allTags.map((tag) => <Tag tag={tag} type={POSITIVE} key={tag[POSITIVE]} />)}
      </div>
      <div className="tags-modal--column">
        {allTags.map((tag) => <div className="tags-modal--separator" key={`separator-${tag[POSITIVE]}`} />)}
      </div>
      <div className="tags-modal--column">
        {allTags.map((tag) => <Tag tag={tag} type={NEGATIVE} key={tag[NEGATIVE]} />)}
      </div>

      {
        // rowsArray.map((_, index) => {
        //   const tagObj = allTags[index];
        //   const positiveTag = tagObj[POSITIVE];
        //   const negativeTag = tagObj[NEGATIVE];
        //   const selectedLabel = tagObj[SELECTED];
        //   const baseTagClasses = 'sema-tag sema-is-rounded';
        //   let positiveClasses = baseTagClasses;
        //   let negativeClasses = baseTagClasses;
        //   if (selectedLabel === POSITIVE) {
        //     positiveClasses += ' sema-is-dark';
        //     negativeClasses += ' sema-is-light';
        //   } else if (selectedLabel === NEGATIVE) {
        //     negativeClasses += ' sema-is-dark';
        //     positiveClasses += ' sema-is-light';
        //   } else {
        //     positiveClasses += ' sema-is-light';
        //     negativeClasses += ' sema-is-light';
        //   }
        //
        //   const isLastRow = index === rowsArray.length - 1;
        //
        //   const tagRowContainerStyle = !isLastRow ? 'sema-mb-4' : '';
        //
        //   return (
        //     <div className={tagRowContainerStyle} key={`${positiveTag}${negativeTag}`}>
        // eslint-disable-next-line max-len
        //       <div className="sema-columns sema-pt-2 sema-pb-2 sema-mb-0 sema-is-flex sema-is-align-items-center">
        //         {getTagColumn(positiveClasses, positiveTag, selectedLabel, POSITIVE)}
        //         <div className="sema-tags-separator" />
        //         {getTagColumn(negativeClasses, negativeTag, selectedLabel, NEGATIVE)}
        //       </div>
        //     </div>
        //   );
        // })
      }
    </div>
  );
}

export default TagsModal;
