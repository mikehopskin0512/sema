import React, { useState } from 'react';
import { connect } from 'react-redux';

import TagsModal from './TagsModal.jsx';
import EmojiSelection from './EmojiSelection.jsx';

import {
  toggleTagModal,
  updateSelectedEmoji,
  updateSelectedTags,
  updateSelectedTagsWithSuggestion,
  toggleIsSelectingEmoji,
} from './modules/redux/action';

const DROP_POSITIONS = {
  UP: 'sema-is-up',
  DOWN: 'sema-is-right',
};

import { DELETE_OP, SELECTED, EMOJIS, SEMA_WEB_LOGIN } from './constants';

const mapStateToProps = (state, ownProps) => {
  const { semabars, github, user } = state;
  const semabarState = semabars[ownProps.id];

  return {
    isTagModalVisible: semabarState.isTagModalVisible,
    selectedTags: semabarState.selectedTags,
    selectedReaction: semabarState.selectedReaction,
    suggestedTags: semabarState.suggestedTags,
    isTyping: github.isTyping,
    isReactionDirty: semabarState.isReactionDirty,
    isLoggedIn: user?.isLoggedIn,
    isWaitlist: user?.isWaitlist,
    isSelectingEmoji: semabarState.isSelectingEmoji,
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
    toggleIsSelectingEmoji: () => dispatch(toggleIsSelectingEmoji({ id })),
  };
};

const Semabar = (props) => {
  const [isHover, setHover] = useState(false);
  const [dropPosition, setDropPosition] = useState(DROP_POSITIONS.DOWN);
  const [tagsButtonPositionValues, setTagsButtonPositionValues] = useState({});

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
              style={{ height: '2.5em' }}
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
    const { x, y, height, width, offsetPos } = tagsButtonPositionValues;
    let dropPosition = DROP_POSITIONS.DOWN;
    const modalHeight = 300;
    const modalWidth = 250;

    if (y && height) {
      const vh = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
      );

      const availableHeight = vh - (y + height);

      if (availableHeight > modalHeight) {
        dropPosition = DROP_POSITIONS.DOWN;
      } else {
        dropPosition = DROP_POSITIONS.UP;
      }
    }

    let containerClasses = `sema-dropdown ${dropPosition}${
      props.isTagModalVisible ? ' sema-is-active' : ''
    }`;

    /**
     * having dropdown within overflow to have scroll
     * and the changes to nearest "relative" positioned parents
     * doesnot play well with bulma's default styles
     * so custom styling is necessary.
     * Prefer to not do it and work with
     * base bulma styles only
     */
    const dropdownStyle =
      dropPosition === DROP_POSITIONS.UP
        ? {
            left: offsetPos.left + width - modalWidth,
            top: offsetPos.top - modalHeight,
          }
        : { marginTop: '-3.5em' };

    return (
      <div className={containerClasses} style={{ position: 'inherit' }}>
        <div className="sema-dropdown-trigger">
          <button
            className="sema-button sema-is-rounded sema-is-small sema-add-tags"
            aria-haspopup="true"
            onClick={(event) => {
              event.preventDefault();
              const {
                x,
                y,
                height,
                width,
              } = event.currentTarget.getBoundingClientRect();
              setTagsButtonPositionValues({
                x,
                y,
                height,
                width,
                offsetPos: {
                  left: event.currentTarget.offsetLeft,
                  top: event.currentTarget.offsetTop,
                },
              });

              props.toggleTagModal();
            }}
          >
            <span className="sema-icon sema-is-small">
              <i className="fas fa-tag"></i>
            </span>
            <span>Add Tags</span>
          </button>
        </div>
        <div
          className="sema-dropdown-menu tags-selection"
          role="menu"
          style={dropdownStyle}
        >
          <div className="tags-selection-header">
            All Tags
          </div>
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
              style={{ cursor: 'pointer', height: '2.5em' }}
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

  if (props.isLoggedIn && !props.isWaitlist) {
    return (
      <>
        <div className="sema-emoji-container">
          <EmojiSelection
            allEmojis={EMOJIS}
            selectedReaction={props.selectedReaction}
            onEmojiSelected={(emojiObj) => {
              props.updateSelectedEmoji(emojiObj);
            }}
            isTyping={props.isTyping}
            isReactionDirty={props.isReactionDirty}
            isSelectingEmoji={props.isSelectingEmoji}
            toggleIsSelectingEmoji={props.toggleIsSelectingEmoji}
          />
        </div>
        <div
          className={
            isHover
              ? 'sema-tag-container'
              : 'sema-tag-container hidden-scrollbar'
          }
          style={{ overflowX: 'auto' }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className="sema-tags-content">
            {createActiveTags()}
            {createSuggestedTags()}
          </div>
          {createAddTags()}
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="sema-emoji-container">
          <span>
            Please{' '}
            <a href={SEMA_WEB_LOGIN} target="_blank">
              Log In
            </a>{' '}
            to Sema to get the full code review experience.
          </span>
        </div>
        <div className="sema-tag-container sema-tags-content">
          <button
            disabled
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
      </>
    );
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Semabar);
