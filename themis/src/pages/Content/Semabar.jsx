import React, { useState } from 'react';
import { connect } from 'react-redux';
import $ from 'cash-dom';

import TagsModal from './TagsModal';
import EmojiSelection from './EmojiSelection';

import {
  toggleTagModal,
  updateSelectedEmoji,
  updateSelectedTags,
  toggleIsSelectingEmoji,
} from './modules/redux/action';

import {
  EVENTS, DELETE_OP, SELECTED, EMOJIS, SEMA_LANDING_FAQ,
} from './constants';
import LoginBar from './LoginBar';
import { fireAmplitudeEvent, saveSmartComment } from './modules/content-util';

const DROP_POSITIONS = {
  UP: 'sema-is-up',
  DOWN: 'sema-is-right',
};

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
    updateSelectedEmoji: (emojiObj) => dispatch(
      updateSelectedEmoji({ id, selectedReaction: emojiObj, isDirty: true }),
    ),
    // eslint-disable-next-line max-len
    updateSelectedTags: (operation) => dispatch(updateSelectedTags({ id, operation, isDirty: true })),

    toggleIsSelectingEmoji: () => dispatch(toggleIsSelectingEmoji({ id })),
  };
};

const Semabar = (props) => {
  const {
    isLoggedIn,
    isWaitlist,
    id,
  } = props;
  const [isHover, setHover] = useState(false);
  const [lastSavedComment, setLastSavedComment] = useState(null);
  const [tagsButtonPositionValues, setTagsButtonPositionValues] = useState({});
  const activeElement = $(`#${id}`).prev().get(0);

  const activeElementValue = activeElement?.value;
  const isCommentSaved = lastSavedComment === activeElementValue;
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
        {activeTags.map((tag) => (
          <span
            className="sema-tag sema-is-dark sema-is-rounded sema-mr-2"
            style={{ height: '2.5em' }}
            key={tag}
          >
            {tag}
            <button
              aria-label={tag}
              type="button"
              className="sema-delete sema-is-small"
              onClick={() => props.updateSelectedTags({ tag, op: DELETE_OP })}
            />
          </span>
        ))}
      </>
    );
  };
  const createAddTags = () => {
    const {
      y, height, offsetPos,
    } = tagsButtonPositionValues;
    let dropPosition = DROP_POSITIONS.DOWN;
    const modalHeight = 350;

    if (y && height) {
      const vh = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0,
      );

      const availableHeight = vh - (y + height);

      if (availableHeight > modalHeight) {
        dropPosition = DROP_POSITIONS.DOWN;
      } else {
        dropPosition = DROP_POSITIONS.UP;
      }
    }

    const containerClasses = `sema-dropdown ${dropPosition}${
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
    const dropdownStyle = dropPosition === DROP_POSITIONS.UP
      ? { top: offsetPos.top - modalHeight }
      : { marginTop: '-3.5em' };

    return (
      <div className={containerClasses} style={{ position: 'inherit' }}>
        <div className="sema-dropdown-trigger">
          <button
            type="button"
            className="sema-button sema-is-rounded sema-is-small sema-add-tags"
            aria-haspopup="true"
            onClick={(event) => {
              event.preventDefault();
              const {
                x,
                y: targetY,
                height: targetHeight,
                width,
              } = event.currentTarget.getBoundingClientRect();
              setTagsButtonPositionValues({
                x,
                y: targetY,
                height: targetHeight,
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
              <i className="fas fa-tag" />
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
            <div className="learn-more-link">
              All Tags
              <a
                href={SEMA_LANDING_FAQ}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  // eslint-disable-next-line max-len
                  fireAmplitudeEvent(EVENTS.CLICKED_ADD_TAGS, {
                    change_tag: false, tag: null, tag_type: null, clicked_faq: true,
                  });
                }}
              >
                Learn more about tags
              </a>
            </div>
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
  const saveComment = async () => {
    try {
      fireAmplitudeEvent(EVENTS.CLICKED_SAVE_TO_MY_COMMENTS);
      await saveSmartComment({ comment: activeElementValue });
      setLastSavedComment(activeElementValue);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('error', e);
    }
  };

  // eslint-disable-next-line react/destructuring-assignment
  if (isLoggedIn && !isWaitlist) {
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
            id={props.id}
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
          <div className="sema-tags-content">{createActiveTags()}</div>
          {createAddTags()}
          <div className="sema-login-bar--separator" />
          {isCommentSaved ? (
            <span style={{ color: '#909AA4' }}>Saved!</span>
          ) : (
            <button
              type="button"
              disabled={!activeElementValue}
              className="sema-button sema-is-small sema-button--save-comment"
              onClick={saveComment}
            >
              <span>+</span>
              Save
            </button>
          )}
        </div>
      </>
    );
  }
  return (
    <>
      <LoginBar />
      <div className="sema-tag-container sema-tags-content">
        <button
          type="button"
          disabled
          className="sema-button sema-is-rounded sema-is-small sema-add-tags"
          aria-haspopup="true"
          onClick={(event) => {
            event.preventDefault();
            props.toggleTagModal();
          }}
        >
          <span className="sema-icon sema-is-small">
            <i className="fas fa-tag" />
          </span>
          <span>Add Tags</span>
        </button>
      </div>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Semabar);
