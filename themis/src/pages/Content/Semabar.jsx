import React from 'react';
import { connect } from 'react-redux';

import TagsModal from './TagsModal.jsx';
import EmojiSelection from './EmojiSelection.jsx';

import {
  toggleTagModal,
  updateSelectedEmoji,
  updateSelectedTags,
  updateSelectedTagsWithSuggestion,
} from './modules/redux/action';

import { DELETE_OP, SELECTED, EMOJIS } from './constants';

const mapStateToProps = (state, ownProps) => {
  const { semabars } = state;
  const semabarState = semabars[ownProps.id];
  return {
    isTagModalVisible: semabarState.isTagModalVisible,
    selectedTags: semabarState.selectedTags,
    selectedReaction: semabarState.selectedReaction,
    suggestedTags: semabarState.suggestedTags,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { id } = ownProps;
  return {
    toggleTagModal: () => dispatch(toggleTagModal({ id })),
    updateSelectedEmoji: (emojiObj) =>
      dispatch(
        updateSelectedEmoji({ id, selectedReaction: emojiObj, isDirty: true })
      ),
    updateSelectedTags: (operation) =>
      dispatch(updateSelectedTags({ id, operation, isDirty: true })),
    updateSelectedTagsWithSuggestion: (tag) =>
      dispatch(updateSelectedTagsWithSuggestion({ id, tag })),
  };
};

const Semabar = (props) => {
  const createActiveTags = () => {
    const activeTags = props.selectedTags.reduce((acc, tagObj) => {
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
                onClick={() => props.updateSelectedTags({ tag, op: DELETE_OP })}
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
                allTags={props.selectedTags}
                toggleTagSelection={props.updateSelectedTags}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const createSuggestedTags = () => {
    return (
      <>
        {props.suggestedTags.map((tag) => {
          return (
            <span
              className="sema-tag sema-is-rounded sema-mr-2"
              style={{ cursor: 'pointer' }}
              key={tag}
              onClick={() => {
                props.updateSelectedTagsWithSuggestion(tag);
              }}
            >
              {tag}
            </span>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div className="sema-emoji-container">
        <EmojiSelection
          allEmojis={EMOJIS}
          selectedReaction={props.selectedReaction}
          onEmojiSelected={(emojiObj) => {
            props.updateSelectedEmoji(emojiObj);
          }}
        />
      </div>
      <div className="sema-tag-container">
        {createAddTags()}
        {createActiveTags()}
        {createSuggestedTags()}
      </div>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Semabar);
