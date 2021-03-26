import React, { useState } from 'react';
import Emoji from './modules/emoji.js';

function EmojiSelection({ allEmojis, selectedReaction, onEmojiSelected }) {
  const [isSelectingEmoji, toggleEmojiSelection] = useState(false);

  const { title: selectedTitle, image: selectedImage, emoji: shownEmoji } = selectedReaction;
  return (
    <>
      {isSelectingEmoji ? (
        <div className="reaction-selection-wrapper">
        {allEmojis.map((emojiObj) => {
          const { title, image, emoji } = emojiObj;
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
              <Emoji symbol={emoji}/>
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
          <Emoji symbol={shownEmoji}/>
          <span className="sema-ml-2">{selectedTitle}</span>
        </button>
      )}
    </>
  );
}

export default EmojiSelection;
