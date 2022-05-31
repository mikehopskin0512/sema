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
  isSelected,
  isSelectMode,
  onViewChange
}) {
  const NoteIcon = chrome.runtime.getURL('img/notebook.svg');

  const getWrapperClass = () => {
    const classes = [];
    if (isSelected) {
      classes.push('suggestion-comment-active');
    }

    if (isSelectMode && isSelected) {
      classes.push('suggestion-comment-pending');
    }

    isViewed ? classes.push('suggestion-comment-no-hover') : classes.push('suggestion-comment');

    return classes.join(' ');
  };

  const getButtonsWrapperClass = () => {
    const classes = ['active-buttons-container'];

    if (isSelected) classes.push('active-buttons-container-selected')

    return classes.join(' ');
  };

  const onInsertClick = () => onInsertPressed(
    id,
    title,
    sourceName,
    comment + sourceUrlToLink(sourceName, sourceUrl),
  );

  return (
    <div
      className={getWrapperClass()}
      id={id}
      onClick={onInsertClick}
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
              <div className={getButtonsWrapperClass()}>
                <ControlButton
                  icon="fa-copy"
                  title="Learn more"
                  // eslint-disable-next-line max-len
                  onClick={onViewChange}
                />
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
                  onClick={onInsertClick}
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
