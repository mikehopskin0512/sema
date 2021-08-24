import React from 'react';
import {
  POSITIVE, NEGATIVE, SELECTED, TOGGLE_OP,
} from './constants';

function TagsModal({ allTags, toggleTagSelection }) {
  const allTagsLength = allTags.length;
  const numRows = (allTagsLength);
  const rowsArray = Array.from(Array(numRows));

  const getTagColumn = (classes, tag, selectedLabel, tagType) => (
    <div className="sema-column sema-pt-0 sema-pb-0">
      <span
        className={classes}
        style={{ cursor: 'pointer' }}
        onClick={() => {
          toggleTagSelection({
            tag,
            isSelected: selectedLabel === tagType,
            op: TOGGLE_OP,
          });
        }}
      >
        {tag}
      </span>
    </div>
  );

  return (
    <div className="sema-is-mobile">
      {
        rowsArray.map((_, index) => {
          const tagObj = allTags[index];
          const positiveTag = tagObj[POSITIVE];
          const negativeTag = tagObj[NEGATIVE];
          const selectedLabel = tagObj[SELECTED];
          const baseTagClasses = 'sema-tag sema-is-rounded';
          let positiveClasses = baseTagClasses;
          let negativeClasses = baseTagClasses;
          if (selectedLabel === POSITIVE) {
            positiveClasses += ' sema-is-dark';
            negativeClasses += ' sema-is-light';
          } else if (selectedLabel === NEGATIVE) {
            negativeClasses += ' sema-is-dark';
            positiveClasses += ' sema-is-light';
          } else {
            positiveClasses += ' sema-is-light';
            negativeClasses += ' sema-is-light';
          }

          const isLastRow = index === rowsArray.length - 1;

          const tagRowContainerStyle = !isLastRow ? 'sema-mb-3' : '';

          return (
            <div className={tagRowContainerStyle} key={`${positiveTag}${negativeTag}`}>
              <div className="sema-columns sema-pt-2 sema-pb-2 sema-mb-0">
                {getTagColumn(positiveClasses, positiveTag, selectedLabel, POSITIVE)}
                {getTagColumn(negativeClasses, negativeTag, selectedLabel, NEGATIVE)}
              </div>
              {!isLastRow && <hr className="sema-mt-0 sema-mb-0" />}
            </div>
          );
        })
      }
    </div>
  );
}

export default TagsModal;
