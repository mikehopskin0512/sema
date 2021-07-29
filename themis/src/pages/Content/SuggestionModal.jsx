import React, { useState } from 'react';
import { MAX_CHARACTER_LENGTH } from './constants';
import GuideLink from './GuideLink';

const truncate = (content) => {
  const contentLength = content.length;
  const shouldTruncate = contentLength > MAX_CHARACTER_LENGTH;
  return shouldTruncate ? `${content.substring(0, Math.min(MAX_CHARACTER_LENGTH, contentLength))
  }...` : content;
};

const getCommentTitleInterface = (title, sourceName) => (
  <div className="suggestion-title">
    <span className="suggestion-name">{title}</span>
    {' '}
    <span className="suggestion-source">{sourceName}</span>
  </div>
);

const getCommentInterface = (comment, isDetailed, sourceName, sourceUrl) => {
  const finalComment = isDetailed ? comment : truncate(comment);
  return (
    <div className="suggestion-content-truncated-container">
      <div
        className="suggestion-content-truncated"
        dangerouslySetInnerHTML={{ __html: finalComment }}
      />
      <GuideLink
        title={sourceName}
        link={sourceUrl}
      />
    </div>
  );
};

function SuggestionModal({ onInsertPressed, searchResults }) {
  const [isCommentDetailsVisible, toggleCommentDetails] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const onViewPressed = (suggestion) => {
    setCurrentSuggestion(suggestion);
    toggleCommentDetails(true);
  };
  const onCopyPressed = (id, suggestion) => {
    navigator.clipboard.writeText(suggestion).then(
      () => {
        setCopiedId(id);
      },
      () => {
        console.error('Could not copy to clipboard');
      },
    );
  };
  const onCommentDetailBackPressed = () => {
    setCurrentSuggestion(null);
    toggleCommentDetails(false);
  };

  const Button = ({ onClick, title, icon }) => (
    <button
      className="sema-button sema-is-inverted sema-is-small"
      style={{ border: 'none' }}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
    >
      <span className="sema-icon">
        <i className={`fas ${icon}`} />
      </span>
      {title && <span>{title}</span>}
    </button>
  );

  const getAllCommentsUI = () => searchResults.map((searchResult, i) => {
    const {
      comment, sourceName, sourceUrl, title, id,
    } = searchResult;
    const isCopied = copiedId === id;

    return (
      <div key={id} className="sema-mb-5">
        {getCommentTitleInterface(title, sourceName)}
        {getCommentInterface(comment, false, sourceName, sourceUrl)}
        <div className="suggestion-buttons">
          <Button
            icon="fa-file-import"
            title="Insert"
            onClick={() => onInsertPressed(id, comment, sourceName, sourceUrl)}
          />
          <Button
            icon="fa-copy"
            title={isCopied ? 'Copied!' : 'Copy'}
            onClick={() => onCopyPressed(id, comment)}
          />
          <Button
            icon="fa-eye"
            title="View"
            onClick={() => onViewPressed(searchResult)}
          />
        </div>
      </div>
    );
  });
  const getCommentUI = () => {
    const {
      comment, sourceName, sourceUrl, title, id,
    } = currentSuggestion;
    const isCopied = copiedId === id;
    return (
      <>
        <div className="suggestion-header">
          <div style={{ marginRight: 'auto' }}>
            <Button
              icon="fa-arrow-left"
              onClick={onCommentDetailBackPressed}
            />
          </div>
          <Button
            title="Insert"
            icon="fa-file-import"
            onClick={() => onInsertPressed(id, comment, sourceName, sourceUrl)}
          />
          <Button
            title={isCopied ? 'Copied!' : 'Copy'}
            icon="fa-copy"
            onClick={() => onCopyPressed(id, comment)}
          />
        </div>
        {getCommentTitleInterface(title, sourceName)}
        {getCommentInterface(comment, true, sourceName, sourceUrl)}
      </>
    );
  };
  const element = isCommentDetailsVisible ? getCommentUI() : getAllCommentsUI();

  return <div>{element}</div>;
}

export default SuggestionModal;
