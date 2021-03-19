import React, { useState } from 'react';
import Emoji from './modules/emoji.js';

function EmojiSelection({ allEmojis, selectedEmoji, onEmojiSelected }) {
  const [isSelectingEmoji, toggleEmojiSelection] = useState(false);

  const { title: selectedTitle, emoji: shownEmoji } = selectedEmoji;
  return (
    <>
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
    </>
  );
}

export default EmojiSelection;
