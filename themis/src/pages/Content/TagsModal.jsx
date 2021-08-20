import React from 'react';
import {
  POSITIVE, NEGATIVE, SELECTED, TOGGLE_OP,
} from './constants';

function TagsModal({ allTags, toggleTagSelection }) {
  const allTagsLength = allTags.length;
  const numRows = (allTagsLength);
  const rowsArray = Array.from(Array(numRows));

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
                <div className="sema-column sema-pt-0 sema-pb-0">
                  <span
                    className={positiveClasses}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      toggleTagSelection({
                        tag: positiveTag,
                        isSelected: selectedLabel === POSITIVE,
                        op: TOGGLE_OP,
                      });
                    }}
                  >
                    {positiveTag}
                  </span>
                </div>
                <div className="sema-column sema-pt-0 sema-pb-0">
                  <span
                    className={negativeClasses}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      toggleTagSelection({
                        tag: negativeTag,
                        isSelected: selectedLabel === NEGATIVE,
                        op: TOGGLE_OP,
                      });
                    }}
                  >
                    {negativeTag}
                  </span>
                </div>
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
