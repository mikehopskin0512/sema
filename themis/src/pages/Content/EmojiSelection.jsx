/* eslint-disable react/no-danger */
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import Lottie from 'react-lottie-player';
import $ from 'cash-dom';
import useOutsideClick from './helpers/useOutsideClick';

import Emoji from './modules/Emoji';
import * as animationData from './LoadingAnimation.json';
import { SEGMENT_EVENTS, SEMA_FAQ_SUMMARIES } from './constants';
import { segmentTrack } from './modules/segment';

const EmojiSelection = ({
  allEmojis,
  selectedReaction,
  onEmojiSelected,
  isTyping,
  isReactionDirty,
  toggleIsSelectingEmoji,
  isSelectingEmoji,
  id,
}) => {
  const { user: { _id: userId } } = useSelector((state) => state);
  const { title: selectedTitle, emoji: shownEmoji } = selectedReaction;
  const selectedReactionPosition = allEmojis.findIndex((e) => e.title === selectedTitle);
  // depends on actual layout
  const ITEM_HEIGHT = 44;

  const { activeElement } = document;

  const semabarActiveElementSibling = $(`#${id}`).prev().get(0);

  const showCalculate = semabarActiveElementSibling === activeElement;
  const isCalculating = showCalculate && isTyping && !isSelectingEmoji && !isReactionDirty;

  const emojiList = useRef(null);
  useOutsideClick(emojiList, () => isSelectingEmoji && toggleIsSelectingEmoji());
  return (
    <div ref={emojiList}>
      <div className="reaction-selection-wrapper">
        <div className={`sema-dropdown${isSelectingEmoji ? ' sema-is-active' : ''}`}>
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
              {isCalculating ? (
                <div style={{ height: '13px', width: '13px' }}>
                  <Lottie play loop animationData={animationData} />
                </div>
              ) : (
                <Emoji symbol={shownEmoji} />
              )}
              &nbsp;&nbsp;
              <span dangerouslySetInnerHTML={{ __html: isCalculating ? 'Calculating...' : selectedTitle }} />
              {/* <i className="sema-ml-2 fas fa-caret-right" style={{ paddingTop: 2 }} /> */}
            </button>
          </div>
          <div
            className="sema-dropdown-menu"
            role="menu"
            style={{ top: selectedReactionPosition * -ITEM_HEIGHT }}
          >
            <div className="sema-dropdown-content">
              {allEmojis.map((emoji) => (
                <button
                  type="button"
                  className="sema-dropdown-item sema-button sema-is-small sema-reaction-selection"
                  title={emoji.title}
                  /* eslint-disable-next-line no-underscore-dangle */
                  key={emoji._id}
                  onClick={(event) => {
                    event.preventDefault();
                    onEmojiSelected(emoji);
                    toggleIsSelectingEmoji();
                    // eslint-disable-next-line max-len
                    segmentTrack(SEGMENT_EVENTS.CLICKED_REACTION, userId, { change_reaction: true, reaction: emoji.title, clicked_faq: false });
                  }}
                >
                  <Emoji symbol={emoji.emoji} />
                  <span
                    className="sema-ml-3"
                    dangerouslySetInnerHTML={{ __html: emoji.title }}
                  />
                </button>
              ))}
              <div className="learn-more-link learn-more-link--reactions">
                <a
                  rel="noreferrer"
                  target="_blank"
                  href={SEMA_FAQ_SUMMARIES}
                  onClick={() => {
                    // eslint-disable-next-line max-len
                    segmentTrack(SEGMENT_EVENTS.CLICKED_REACTION, userId, { change_reaction: false, reaction: null, clicked_faq: true });
                  }}
                >
                  Learn more about summaries
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmojiSelection;
