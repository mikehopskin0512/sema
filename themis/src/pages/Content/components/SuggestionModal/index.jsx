import React, { useState } from 'react';
import { getActiveThemeClass } from '../../../../../utils/theme';
import { MAX_CHARACTER_LENGTH, SEMA_ENG_GUIDE_UI_URL } from '../../constants';
import SuggestionModalFooter from './SuggestionModalFooter';
import SuggestionComment from './SuggestionComment';

const truncate = (content) => {
  const contentLength = content?.length;
  const shouldTruncate = contentLength > MAX_CHARACTER_LENGTH;
  return shouldTruncate ? `${content.substring(0, Math.min(MAX_CHARACTER_LENGTH, contentLength))
  }...` : content;
};

const getCollectionUrl = (id, slug) => `${SEMA_ENG_GUIDE_UI_URL}/${id}/${slug}`;

function SuggestionModal({ onInsertPressed, searchResults, onLastUsedSmartComment }) {
  const [isCommentDetailsVisible, toggleCommentDetails] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const engGuidesToStr = (engGuides) => {
    const links = engGuides?.map(({ name, engGuide, slug }) => {
      const url = getCollectionUrl(engGuide, slug);
      return `\n\n📄 [${name}](${url})`;
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

  const AllComments = () => searchResults.map((searchResult) => {
    const {
      comment, sourceName, title, id, engGuides,
    } = searchResult;
    const isCopied = copiedId === id;

    return (
      <div key={id} className="sema-mb-5">
        <SuggestionComment
          title={title}
          sourceName={sourceName}
          comment={truncate(comment)}
          engGuides={engGuides}
          getCollectionUrl={getCollectionUrl}
        />
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
  const Comment = () => {
    const {
      comment, sourceName, engGuides, title, id,
    } = currentSuggestion || {};
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
        {title && comment && (
          <SuggestionComment
            title={title}
            sourceName={sourceName}
            comment={comment}
            engGuides={engGuides}
            getCollectionUrl={getCollectionUrl}
          />
        )}
      </>
    );
  };
  const wrapperWidth = 345;

  return (
    <div
      className="sema-is-flex overflow-hidden"
      style={{
        width: wrapperWidth,
        height: '430px',
      }}
    >
      <div
        className="sema-is-flex sema-is-flex-direction-column sema-is-relative"
        style={{
          minWidth: wrapperWidth,
          overflowY: 'scroll',
        }}
      >
        <AllComments />
        <SuggestionModalFooter />
      </div>
      <div
        className={`sema-is-flex sema-is-flex-direction-column sema-is-relative view-suggestion-modal ${getActiveThemeClass()}`}
        style={{
          minWidth: wrapperWidth,
          top: 0,
          left: isCommentDetailsVisible ? '-100%' : '0%',
          transition: '.15s ease-out',
          zIndex: 2,
          overflowY: 'scroll',
        }}
      >
        <Comment />
        <SuggestionModalFooter />
      </div>
    </div>
  );
}

export default SuggestionModal;
