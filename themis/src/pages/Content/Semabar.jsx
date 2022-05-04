import React, { useState } from 'react';
import { connect } from 'react-redux';

import TagsModal from './components/TagsModal';
import EmojiSelection from './EmojiSelection';

import { toggleIsSelectingEmoji, toggleTagModal, updateSelectedEmoji, updateSelectedTags } from './modules/redux/action';

import { EMOJIS, SEGMENT_EVENTS, SELECTED, SEMA_FAQ_TAGS } from './constants';
import LoginBar from './LoginBar';
import Tag from './components/tag';
import { segmentTrack } from './modules/segment';
import { getActiveThemeClass } from '../../../utils/theme';

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
    userId: user?._id,
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
    userId,
    isLoggedIn,
    isWaitlist,
    updateSelectedTags,
  } = props;
  const [isHover, setHover] = useState(false);
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
        {activeTags.map((tag) => (
          <Tag tag={tag} updateSelectedTags={updateSelectedTags} key={tag} />
        ))}
      </>
    );
  };

  const createAddTags = () => {
    const {
      y, height, offsetPos, pageY,
    } = tagsButtonPositionValues;

    let dropPosition = DROP_POSITIONS.DOWN;
    const modalHeight = 350;
    const isUpperModal = pageY < 720;

    if (y && height) {
      const vh = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0,
      );

      const availableHeight = vh - (y + height);

      if (availableHeight > modalHeight || isUpperModal) {
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
      : { top: '20px', maxHeight: 'fit-content', position: 'absolute' };

    return (
      <div className={`${containerClasses} ${getActiveThemeClass()}`} style={{ position: 'inherit' }}>
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
                pageY: event.pageY,
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
          className={`sema-dropdown-menu tags-selection ${getActiveThemeClass()}`}
          role="menu"
          style={dropdownStyle}
        >
          <div className="tags-selection-header">
            <div className="learn-more-link">
              All Tags
              <a
                href={SEMA_FAQ_TAGS}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  // eslint-disable-next-line max-len
                  segmentTrack(SEGMENT_EVENTS.CLICKED_ADD_TAGS, userId, {
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
                toggleTagSelection={updateSelectedTags}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // eslint-disable-next-line react/destructuring-assignment
  if (isLoggedIn && !isWaitlist) {
    return (
      <>
        <div className="sema-emoji-container sema-is-flex sema-is-flex-direction-column">
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
