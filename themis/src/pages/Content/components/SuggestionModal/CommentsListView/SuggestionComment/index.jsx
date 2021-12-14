import React from 'react';
import ControlButton from '../ControlButton';
import { sourceUrlToLink } from '../../helpers';

function SuggestionComment({
  title,
  sourceName,
  comment,
  id,
  onInsertPressed,
  onCopyPressed,
  isCopied,
  isViewed = false,
  author,
  sourceUrl,
  sourceIcon,
}) {
  const NoteIcon = chrome.runtime.getURL('img/notebook.svg');

  return (
    <div
      className={
        isViewed ? 'suggestion-comment-no-hover' : 'suggestion-comment'
      }
    >
      {!isViewed && (
        <div className="suggestion-title">
          <span className="suggestion-name">{title}</span>
          {' '}
          {sourceIcon && (
            <img src={sourceIcon} className="source-icon" alt="icon" />
          )}
          <span className="suggestion-source">{sourceName}</span>
          {!isViewed && (
            <>
              {' | '}
              <span className="suggestion-author">{author}</span>
              <div className="active-buttons-container">
                <ControlButton
                  icon="fa-copy"
                  title={isCopied ? 'Copied!' : 'Copy'}
                  // eslint-disable-next-line max-len
                  onClick={() => onCopyPressed(
                    id,
                    title,
                    sourceName,
                    comment + sourceUrlToLink(sourceName, sourceUrl),
                  )}
                />
                <ControlButton
                  icon="fa-file-import"
                  title="Insert"
                  // eslint-disable-next-line max-len
                  onClick={() => onInsertPressed(
                    id,
                    title,
                    sourceName,
                    comment + sourceUrlToLink(sourceName, sourceUrl),
                  )}
                />
              </div>
            </>
          )}
        </div>
      ) }
      <div className="suggestion-content-truncated-container">
        <span className="suggestion-comment-text">{comment}</span>
        {isViewed && (
          <div className="sema-is-flex" style={{ marginTop: '16px' }}>
            <div style={{ marginRight: '4px' }}>
              <img src={NoteIcon} alt="note" className="note-icon" />
            </div>
            <a href={sourceUrl} className="suggestion-soucreUrl">
              {sourceName}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuggestionComment;
