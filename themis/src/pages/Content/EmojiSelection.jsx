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
          {isSelectingEmoji ? (
            <div className="reaction-selection-wrapper">
              {allEmojis.map((emojiObj) => {
                const { title, emoji } = emojiObj;
                return (
                  <button
                    className="zoom sema-button sema-is-small sema-is-ghost reaction-selection"
                    title={title}
                    key={title}
                    onClick={() => {
                      onEmojiSelected(emojiObj);
                      toggleIsSelectingEmoji();
                    }}
                  >
                    <Emoji symbol={emoji} />
                  </button>
                );
              })}
            </div>
          ) : (
            <button
              className="sema-button sema-is-small sema-is-squared"
              title={selectedTitle}
              onClick={() => {
                toggleIsSelectingEmoji();
              }}
            >
              <Emoji symbol={shownEmoji} />
              <span className="sema-ml-2">{selectedTitle}</span>
            </button>
          )}
        </div>
      )}
    </>
  );
};
export default EmojiSelection;
