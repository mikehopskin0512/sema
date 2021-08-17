/* eslint-disable react/no-danger */
import React from 'react';
import Lottie from 'react-lottie-player';
import Emoji from './modules/Emoji';
import * as animationData from './LoadingAnimation.json';

const EmojiSelection = ({
  allEmojis,
  selectedReaction,
  onEmojiSelected,
  isTyping,
  isReactionDirty,
  toggleIsSelectingEmoji,
  isSelectingEmoji,
}) => {
  const { title: selectedTitle, emoji: shownEmoji } = selectedReaction;
  const selectedReactionPosition = allEmojis.findIndex((e) => e.title === selectedTitle);
  // depends on actual layout
  const ITEM_HEIGHT = 44;

  // TODO: needs to be refactored to one good-looking button
  return (
    <>
      {isTyping === true
      && isSelectingEmoji === false
      && isReactionDirty === false ? (
        <div
          onClick={() => {
            toggleIsSelectingEmoji(true);
          }}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            cursor: 'pointer',
            paddingTop: 3,
          }}
        >
          <div style={{ margin: '0 8px 6px', height: '13px', width: '13px' }}>
            <Lottie play loop animationData={animationData} />
          </div>
          <span style={{ fontSize: '12px' }}>
            Calculating...
          </span>
          <i className="sema-ml-2 fas fa-caret-right" />
        </div>
        ) : (
          <div>
            <div className="reaction-selection-wrapper">
              <div
                className={`sema-dropdown${
                  isSelectingEmoji ? ' sema-is-active' : ''
                }`}
              >
                <div className="sema-dropdown-trigger">
                  <button
                    type="button"
                    className="sema-button sema-is-small sema-is-squared"
                    title={selectedTitle}
                    onClick={(event) => {
                      event.preventDefault();
                      toggleIsSelectingEmoji();
                    }}
                  >
                    <Emoji symbol={shownEmoji} />
                  &nbsp;&nbsp;
                    <span dangerouslySetInnerHTML={{ __html: selectedTitle }} />
                    <i className="sema-ml-2 fas fa-caret-right" />
                  </button>
                </div>
                <div
                  className="sema-dropdown-menu"
                  role="menu"
                  style={{ top: selectedReactionPosition * -ITEM_HEIGHT }}
                >
                  <div className="sema-dropdown-content">
                    {allEmojis.map((emojiObj) => {
                      const { title, emoji } = emojiObj;
                      return (
                        <button
                          type="button"
                          className="sema-dropdown-item sema-button sema-is-small sema-reaction-selection"
                          title={title}
                          key={title}
                          onClick={(event) => {
                            event.preventDefault();
                            onEmojiSelected(emojiObj);
                            toggleIsSelectingEmoji();
                          }}
                        >
                          <Emoji symbol={emoji} />
                          <span
                            className="sema-ml-3"
                            dangerouslySetInnerHTML={{ __html: title }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
};
export default EmojiSelection;
