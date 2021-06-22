import React, { useState } from 'react';
import Lottie from 'react-lottie';
import Emoji from './modules/emoji.js';
import * as animationData from './LoadingAnimation.json';

const animationOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

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
  return (
    <>
      {isTyping === true &&
      isSelectingEmoji === false &&
      isReactionDirty === false ? (
        <div
          onClick={() => {
            toggleIsSelectingEmoji(true);
          }}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <Lottie options={animationOptions} height={20} width={20} />{' '}
          <span style={{ paddingLeft: 8, paddingRight: 8 }}>
            Calculating...
          </span>
          <i className="fas fa-caret-right"></i>
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
                  className="sema-button sema-is-small sema-is-squared"
                  title={selectedTitle}
                  onClick={(event) => {
                    event.preventDefault();
                    toggleIsSelectingEmoji();
                  }}
                >
                  <Emoji symbol={shownEmoji} />
                  <span
                    className="sema-ml-2"
                    dangerouslySetInnerHTML={{ __html: selectedTitle }}
                  ></span>
                </button>
              </div>
              <div
                className="sema-dropdown-menu"
                role="menu"
                style={{ borderRadius: '10px' }}
              >
                <div
                  className="sema-dropdown-content"
                  style={{ borderRadius: '10px' }}
                >
                  {allEmojis.map((emojiObj) => {
                    const { title, emoji } = emojiObj;
                    return (
                      <button
                        className="sema-dropdown-item sema-button sema-is-small sema-is-ghost reaction-selection"
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
                          dangerouslySetInnerHTML={{ __html: title }}
                        ></span>
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
