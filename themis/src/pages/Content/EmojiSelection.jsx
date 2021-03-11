import React, { useState } from 'react';
import Emoji from './modules/emoji.js';

function EmojiSelection({ allEmojis, selectedEmoji, onEmojiSelected }) {
  const [isSelectingEmoji, toggleEmojiSelection] = useState(false);

  const { title: selectedTitle, image: selectedImage, emoji: shownEmoji } = selectedEmoji;
  return (
    <>
      {isSelectingEmoji ? (
        allEmojis.map((emojiObj) => {
          const { title, image, emoji } = emojiObj;
          return (
            <button
              className="zoom sema-button sema-is-small"
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
        })
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
