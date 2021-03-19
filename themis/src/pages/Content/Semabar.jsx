import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import TagsModal from './TagsModal.jsx';
import EmojiSelection from './EmojiSelection.jsx';

import { toggleTagModal } from './modules/redux/action';

import { DELETE_OP, POSITIVE, NEGATIVE, SELECTED, EMOJIS } from './constants';

const mapStateToProps = (state, ownProps) => {
  const { semabars } = state;
  return {
    isTagModalVisible: semabars[ownProps.id].isTagModalVisible,
    initialTags: ownProps.initialTags,
    initialReaction: ownProps.initialReaction,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    toggleTagModal: () => dispatch(toggleTagModal({ id: ownProps.id })),
  };
};

const Semabar = (props) => {
  const [allTags, updateSelectedTags] = useState(props.initialTags);
  const [selectedReaction, updateSelectedReaction] = useState(
    props.initialReaction
  );
  const [userSelectedReaction, setUserSelectedReaction] = useState(false);
  const [userSelectedTags, setUserSelectedTags] = useState(false);

  // useEffect(() => {
  //   if (!userSelectedReaction) {
  //     updateSelectedReaction(initialReaction);
  //   }
  //   if (!userSelectedTags) {
  //     updateSelectedTags(initialTags);
  //   }
  // }, [initialTags, initialReaction, userSelectedReaction, userSelectedTags]);

  const handleReactionSelection = (emojiObj) => {
    updateSelectedReaction(emojiObj);
    setUserSelectedReaction(true);
  };

  const toggleTagSelection = (operation) => {
    /**
     * {
     * tag: string
     * op: toggle | delete
     * }
     */
    const { tag, isSelected, op } = operation;
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

        // If tag is already selected, set selection to null on toggle
        if (
          isSelected &&
          (tag === tagObj[POSITIVE] || tag === tagObj[NEGATIVE])
        ) {
          modifiedObj[SELECTED] = null;
          return modifiedObj;
        }

        // Otherwise, set positive or negative tag for selection
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
      props.isTagModalVisible ? ' sema-is-active' : ''
    }`;

    return (
      <div className={containerClasses}>
        <div className="sema-dropdown-trigger">
          <button
            className="sema-button sema-is-rounded sema-is-small sema-add-tags"
            aria-haspopup="true"
            onClick={(event) => {
              event.preventDefault();
              props.toggleTagModal();
            }}
          >
            <span className="sema-icon sema-is-small">
              <i className="fas fa-tag"></i>
            </span>
            <span>Add Tags</span>
          </button>
        </div>
        <div className="sema-dropdown-menu" role="menu">
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
      <div className="sema-emoji-container">
        <EmojiSelection
          allEmojis={EMOJIS}
          selectedReaction={selectedReaction}
          onEmojiSelected={(emojiObj) => {
            handleReactionSelection(emojiObj);
          }}
        />
      </div>
      <div className="sema-tag-container">
        {createAddTags()}
        {createActiveTags()}
      </div>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Semabar);
