import React, { useState } from 'react';
import { connect } from 'react-redux';

import TagsModal from './TagsModal.jsx';
import EmojiSelection from './EmojiSelection.jsx';

import {
  toggleTagModal,
  updateSelectedEmoji,
  updateSelectedTags,
  updateSelectedTagsWithSuggestion,
} from './modules/redux/action';

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
  const [isHover, setHover] = useState(false);

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
    let containerClasses = `sema-dropdown sema-is-right${
      props.isTagModalVisible ? ' sema-is-active' : ''
    }`;

    return (
      <div className={containerClasses} style={{ position: 'inherit' }}>
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
        <div
          className="sema-dropdown-menu tags-selection"
          role="menu"
          style={{ marginTop: '-3.5em' }}
        >
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
