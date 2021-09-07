import React, { useState } from 'react';
import { MAX_CHARACTER_LENGTH, SEMA_ENG_GUIDE_UI_URL } from './constants';
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

const getCommentInterface = (comment, isDetailed, engGuides) => {
  const finalComment = isDetailed ? comment : truncate(comment);
  return (
    <div className="suggestion-content-truncated-container">
      <div
        className="suggestion-content-truncated"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: finalComment }}
      />
      {engGuides?.map(({ engGuide }) => (
        <GuideLink
          title={engGuide.title || engGuide.source?.name}
          link={engGuide.source?.url}
        />
      ))}
    </div>
  );
};

function SuggestionModal({ onInsertPressed, searchResults, onLastUsedSmartComment }) {
  const [isCommentDetailsVisible, toggleCommentDetails] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const engGuidesToStr = (engGuides) => {
    const links = engGuides?.map(({ engGuide, slug }) => {
      const caption = engGuide.title || engGuide.source?.name;
      // eslint-disable-next-line no-underscore-dangle
      const url = `${SEMA_ENG_GUIDE_UI_URL}/${engGuide._id}/${slug}`;
      return `\n\n📄 [${caption}](${url})`;
    }).join(' ');
    return links || '';
  };
  const onViewPressed = (suggestion) => {
    setCurrentSuggestion(suggestion);
    toggleCommentDetails(true);
  };
  const onCopyPressed = (id, suggestion) => {
    navigator.clipboard.writeText(suggestion).then(
      () => {
        setCopiedId(id);
        onLastUsedSmartComment(suggestion);
      },
      () => {
        // eslint-disable-next-line no-console
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
      type="button"
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

  const getAllCommentsUI = () => searchResults.map((searchResult) => {
    const {
      comment, sourceName, title, id, engGuides,
    } = searchResult;
    const isCopied = copiedId === id;

    return (
      <div key={id} className="sema-mb-5">
        {getCommentTitleInterface(title, sourceName)}
        {getCommentInterface(comment, false, engGuides)}
        <div className="suggestion-buttons">
          <Button
            icon="fa-file-import"
            title="Insert"
            onClick={() => onInsertPressed(id, comment + engGuidesToStr(engGuides))}
          />
          <Button
            icon="fa-copy"
            title={isCopied ? 'Copied!' : 'Copy'}
            onClick={() => onCopyPressed(id, comment + engGuidesToStr(engGuides))}
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
      comment, sourceName, engGuides, title, id,
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
            onClick={() => onInsertPressed(id, comment + engGuidesToStr(engGuides))}
          />
          <Button
            title={isCopied ? 'Copied!' : 'Copy'}
            icon="fa-copy"
            onClick={() => onCopyPressed(id, comment + engGuidesToStr(engGuides))}
          />
        </div>
        {getCommentTitleInterface(title, sourceName)}
        {getCommentInterface(comment, true, engGuides)}
      </>
    );
  };
  const element = isCommentDetailsVisible ? getCommentUI() : getAllCommentsUI();

  return <div>{element}</div>;
}

export default SuggestionModal;
