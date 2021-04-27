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

function EmojiSelection({
  allEmojis,
  selectedReaction,
  onEmojiSelected,
  userInitialTypeAction,
}) {
  const [isSelectingEmoji, toggleEmojiSelection] = useState(false);
  const { title: selectedTitle, emoji: shownEmoji } = selectedReaction;
  return (
    <>
      {userInitialTypeAction == false ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
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
                      toggleEmojiSelection(!isSelectingEmoji);
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
                toggleEmojiSelection(!isSelectingEmoji);
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
}

export default EmojiSelection;
