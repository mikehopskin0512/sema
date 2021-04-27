import React, { useState } from 'react';
import Emoji from './modules/emoji.js';

function EmojiSelection({ allEmojis, selectedReaction, onEmojiSelected,userInitialTypeAction }) {
  const [isSelectingEmoji, toggleEmojiSelection] = useState(false);
  const { title: selectedTitle, emoji: shownEmoji } = selectedReaction;
  return (
    <> 
      {userInitialTypeAction==false ?(
        <div><i className="fas fa-circle-notch fa-spin"></i>Calculating...
        </div>
        ):
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
      }
    </>
  );
}

export default EmojiSelection;
