import React, { useState } from 'react';
import TagsModal from './TagsModal.jsx';
import EmojiSelection from './EmojiSelection.jsx';

import {
  DELETE_OP,
  POSITIVE,
  NEGATIVE,
  SELECTED,
  TAGS_INIT,
  EMOJIS,
} from './constants';

function Semabar() {
  const [isDropdownVisible, toggleDropdown] = useState(false);
  const [allTags, updateSelectedTags] = useState(TAGS_INIT);
  const [selectedEmoji, updateSelectedEmoji] = useState(EMOJIS[0]);

  const toggleTagSelection = (operation) => {
    /**
     * {
     * tag: string
     * op: toggle | delete
     * }
     */
    const { tag, op } = operation;
    let updatedTags;
    if (op === DELETE_OP) {
      updatedTags = allTags.map((tagObj) => {
        const modifiedObj = { ...tagObj };
        if (tag === tagObj[POSITIVE] || tag === tagObj[NEGATIVE]) {
          modifiedObj[SELECTED] = null;
        }
        return modifiedObj;
      });
    } else {
      updatedTags = allTags.map((tagObj) => {
        const modifiedObj = { ...tagObj };
        if (tag === tagObj[POSITIVE]) {
          modifiedObj[SELECTED] = POSITIVE;
        } else if (tag === tagObj[NEGATIVE]) {
          modifiedObj[SELECTED] = NEGATIVE;
        }
        return modifiedObj;
      });
    }
    updateSelectedTags(updatedTags);
  };

  const createActiveTags = () => {
    const activeTags = allTags.reduce((acc, tagObj) => {
      const selectedTag = tagObj[tagObj[SELECTED]];
      if (selectedTag) {
        acc.push(selectedTag);
      }
      return acc;
    }, []);
    return (
      <>
        {activeTags.map((tag) => {
          return (
            <span
              className="sema-tag sema-is-dark sema-is-rounded sema-mr-2"
              key={tag}
            >
              {tag}
              <button
                className="sema-delete sema-is-small"
                onClick={() => toggleTagSelection({ tag, op: DELETE_OP })}
              ></button>
            </span>
          );
        })}
      </>
    );
  };

  const createAddTags = () => {
    let containerClasses = `sema-dropdown${
      isDropdownVisible ? ' sema-is-active' : ''
    }`;

    return (
      <div className={containerClasses}>
        <div className="sema-dropdown-trigger">
          <button
            className="sema-button sema-is-rounded sema-is-small"
            aria-haspopup="true"
            aria-controls="sema-dropdown-menu2"
            onClick={(event) => {
              event.preventDefault();
              toggleDropdown(!isDropdownVisible);
            }}
          >
            <span>Add Tags</span>
            <span className="sema-icon sema-is-small">
              <i className="sema-fas sema-fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div className="sema-dropdown-menu" id="dropdown-menu2" role="menu">
          <div className="sema-dropdown-content">
            <div className="sema-dropdown-item">
              <TagsModal
                allTags={allTags}
                toggleTagSelection={toggleTagSelection}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <EmojiSelection
        allEmojis={EMOJIS}
        selectedEmoji={selectedEmoji}
        onEmojiSelected={(emojiObj) => {
          updateSelectedEmoji(emojiObj);
        }}
      />
      <div className="sema-tag-container">
        {createAddTags()}
        {createActiveTags()}
      </div>
    </>
  );
}

export default Semabar;
