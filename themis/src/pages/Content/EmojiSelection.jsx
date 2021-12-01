/* eslint-disable react/no-danger */
import React from 'react';
import Lottie from 'react-lottie-player';
import $ from 'cash-dom';

import Emoji from './modules/Emoji';
import * as animationData from './LoadingAnimation.json';
import { EVENTS, SEMA_LANDING_FAQ } from './constants';
import { fireAmplitudeEvent } from './modules/content-util';

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
  const { title: selectedTitle, emoji: shownEmoji } = selectedReaction;
  const selectedReactionPosition = allEmojis.findIndex((e) => e.title === selectedTitle);
  // depends on actual layout
  const ITEM_HEIGHT = 44;

  const { activeElement } = document;

  const semabarActiveElementSibling = $(`#${id}`).prev().get(0);

  const showCalculate = semabarActiveElementSibling === activeElement;
  const isCalculating = showCalculate && isTyping && !isSelectingEmoji && !isReactionDirty;

  return (
    <div>
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
                    fireAmplitudeEvent(EVENTS.CLICKED_REACTION, { change_reaction: true, reaction: emoji.title, clicked_faq: false });
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
                  href={SEMA_LANDING_FAQ}
                  onClick={() => {
                    // eslint-disable-next-line max-len
                    fireAmplitudeEvent(EVENTS.CLICKED_REACTION, { change_reaction: false, reaction: null, clicked_faq: true });
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
