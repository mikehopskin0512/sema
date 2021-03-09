import React, { useState } from 'react';

function EmojiSelection({ allEmojis, selectedEmoji, onEmojiSelected }) {
  const [isSelectingEmoji, toggleEmojiSelection] = useState(false);

  const { title: selectedTitle, image: selectedImage } = selectedEmoji;
  return (
    <>
      {isSelectingEmoji ? (
        allEmojis.map((emojiObj) => {
          const { title, image } = emojiObj;
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
              <img src={image} />
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
          <img src={selectedImage} />
          <span className="sema-ml-2">{selectedTitle}</span>
        </button>
      )}
    </>
  );
}

export default EmojiSelection;
