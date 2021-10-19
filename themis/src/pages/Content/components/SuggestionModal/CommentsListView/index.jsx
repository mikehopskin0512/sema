import React, { useState } from 'react';
import SuggestionModalFooter from '../SuggestionModalFooter';
import { getActiveThemeClass } from '../../../../../../utils/theme';
import SuggestionComment from './SuggestionComment';
import { engGuidesToStr, truncate } from '../helpers';
import ControlButton from './ControlButton';

function CommentsList({ searchResults, onLastUsedSmartComment, onInsertPressed }) {
  const [isCommentDetailsVisible, toggleCommentDetails] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const onViewPressed = (suggestion) => {
    setCurrentSuggestion(suggestion);
    toggleCommentDetails(true);
  };
  const [copiedId, setCopiedId] = useState(null);
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
        />
        <div className="suggestion-buttons">
          <ControlButton
            icon="fa-file-import"
            title="Insert"
            onClick={() => onInsertPressed(id, comment + engGuidesToStr(engGuides))}
          />
          <ControlButton
            icon="fa-copy"
            title={isCopied ? 'Copied!' : 'Copy'}
            onClick={() => onCopyPressed(id, comment + engGuidesToStr(engGuides))}
          />
          <ControlButton
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
            <ControlButton
              icon="fa-arrow-left"
              onClick={onCommentDetailBackPressed}
            />
          </div>
          <ControlButton
            title="Insert"
            icon="fa-file-import"
            onClick={() => onInsertPressed(id, comment + engGuidesToStr(engGuides))}
          />
          <ControlButton
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

export default CommentsList;
