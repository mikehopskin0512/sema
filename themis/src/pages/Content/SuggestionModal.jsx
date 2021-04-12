import React, { useState } from 'react';
import { MAX_CHARACTER_LENGTH } from './constants';

const truncate = (content) => {
  const contentLength = content.length;
  const shouldTruncate = contentLength > MAX_CHARACTER_LENGTH;
  if (shouldTruncate) {
    content =
      content.substring(0, Math.min(MAX_CHARACTER_LENGTH, contentLength)) +
      '...';
  }
  return content;
};

const getCommentTitleInterface = (title, sourceName) => {
  return (
    <div>
      <span className="suggestion-title">{title}</span>{' '}
      <span className="suggestion-via">via {sourceName}</span>
    </div>
  );
};

const getCommentInterface = (comment, isDetailed) => {
  const finalComment = isDetailed ? comment : truncate(comment);
  return (
    <div className="suggestion-content-truncated-container">
      <div
        className="suggestion-content-truncated"
        dangerouslySetInnerHTML={{ __html: finalComment }}
      ></div>
    </div>
  );
};

function SuggestionModal({ onCopyPressed, searchResults }) {
  const [isCommentDetailsVisible, toggleCommentDetails] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);

  const onViewPressed = (suggestion) => {
    setCurrentSuggestion(suggestion);
    toggleCommentDetails(true);
  };

  const onCommentDetailBackPressed = () => {
    setCurrentSuggestion(null);
    toggleCommentDetails(false);
  };

  const getAllCommentsUI = () => {
    const resultsLength = searchResults.length;
    return searchResults.map((searchResult, i) => {
      const { comment, sourceName, sourceUrl, title } = searchResult;
      return (
        <div key={title}>
          {getCommentTitleInterface(title, sourceName)}
          {getCommentInterface(comment, false)}
          <div className="suggestion-buttons">
            <button
              className="sema-button sema-is-inverted sema-is-small"
              style={{ border: 'none' }}
              onClick={(event) => {
                event.preventDefault();
                onCopyPressed(comment);
              }}
            >
              <span className="sema-icon">
                <i className="fas fa-copy"></i>
              </span>
              <span>Insert</span>
            </button>
            <button
              className="sema-button sema-is-inverted sema-is-small"
              style={{ border: 'none' }}
              onClick={(event) => {
                event.preventDefault();
                onViewPressed(searchResult);
              }}
            >
              <span className="sema-icon">
                <i className="fas fa-eye"></i>
              </span>
              <span>View</span>
            </button>
          </div>
          {(resultsLength > i + 1) && <hr />}
        </div>
      );
    });
  };

  const getCommentUI = () => {
    const { comment, sourceName, sourceUrl, title } = currentSuggestion;
    return (
      <>
        <button
          className="sema-button sema-is-inverted sema-is-small"
          style={{ border: 'none' }}
          onClick={onCommentDetailBackPressed}
        >
          <span className="sema-icon">
            <i className="fas fa-arrow-left"></i>
          </span>
        </button>
        {getCommentTitleInterface(title, sourceName)}
        {getCommentInterface(comment, true)}
        <div className="suggestion-buttons">
          <button
            className="sema-button sema-is-inverted sema-is-small"
            style={{ border: 'none' }}
            onClick={(event) => {
              event.preventDefault();
              onCopyPressed(comment);
            }}
          >
            <span className="sema-icon">
              <i className="fas fa-copy"></i>
            </span>
            <span>Copy</span>
          </button>
        </div>
      </>
    );
  };

  const element = isCommentDetailsVisible ? getCommentUI() : getAllCommentsUI();

  return <div>{element}</div>;
}

export default SuggestionModal;
