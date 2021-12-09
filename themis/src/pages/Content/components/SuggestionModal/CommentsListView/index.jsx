import React, { useState } from 'react';
import { getActiveThemeClass } from '../../../../../../utils/theme';
import SuggestionComment from './SuggestionComment';
import { engGuidesToStr, truncate } from '../helpers';
import ControlButton from './ControlButton';
import { EVENTS } from '../../../constants';
import { MAX_CHARACTER_LENGTH } from './constants';
import { fireAmplitudeEvent } from '../../../modules/content-util';

function CommentsList({ searchResults, onLastUsedSmartComment, onInsertPressed, changeIsDetailedView, isDetailedView }) {
  const [isCommentDetailsVisible, toggleCommentDetails] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const onViewPressed = (title, sourceName, suggestion) => {
    setCurrentSuggestion(suggestion);
    toggleCommentDetails(true);
    changeIsDetailedView(true);
    fireAmplitudeEvent(EVENTS.CLICKED_COMMENT_LIBRARY_BAR, { comment_bar_action: 'view', comment_source: sourceName, comment_used: title });
  };
  const [copiedId, setCopiedId] = useState(null);
  const onCopyPressed = (id, title, sourceName, suggestion) => {
    navigator.clipboard.writeText(suggestion).then(
      () => {
        setCopiedId(id);
        onLastUsedSmartComment(suggestion);
        fireAmplitudeEvent(EVENTS.CLICKED_COMMENT_LIBRARY_BAR, { comment_bar_action: 'copy', comment_source: sourceName, comment_used: title });
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
    changeIsDetailedView(false);
  };
  const AllComments = () => searchResults.map((searchResult) => {
    const {
      comment, sourceName, title, id, engGuides, author, sourceUrl, sourceIcon,
    } = searchResult;
    const isCopied = copiedId === id;

    return (
      <div key={id} className="suggestion-comment-container"
        onClick={() => onViewPressed(title, sourceName, searchResult)}>
        <SuggestionComment
          id={id}
          title={truncate(title, MAX_CHARACTER_LENGTH.TITLE)}
          sourceName={sourceName}
          comment={truncate(comment, MAX_CHARACTER_LENGTH.TEXT)}
          engGuides={engGuides}
          onCopyPressed={onCopyPressed}
          onInsertPressed={onInsertPressed}
          isCopied={isCopied}
          author={truncate(author, MAX_CHARACTER_LENGTH.AUTHOR)}
          sourceUrl={sourceUrl}
          sourceIcon={sourceIcon}
        />
      </div>
    );
  });
  const Comment = () => {
    const {
      comment, sourceName, engGuides, title, id, tags, author, sourceUrl, sourceIcon,
    } = currentSuggestion || {};
    const isCopied = copiedId === id;
    return (
      <>
        <div className="suggestion-header">
          <div style={{ marginRight: '17px', marginTop: '2px', }}>
            <ControlButton
              icon="fa-arrow-left"
              onClick={onCommentDetailBackPressed}
              isViewed
            />
          </div>
          <div className="suggestion-title view-mode">
        <span className="suggestion-name">{title}</span>
        {' '}
        {sourceIcon && <img src={sourceIcon} className="source-icon" alt="icon" /> }
        <span className="suggestion-source">{sourceName}</span>
        {' | '}
        <span className={"suggestion-author"}>{author}</span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <ControlButton
            title={isCopied ? 'Copied!' : 'Copy'}
            icon="fa-copy"
            // eslint-disable-next-line max-len
            onClick={() => onCopyPressed(id, title, sourceName, comment + engGuidesToStr(engGuides))}
            isViewed
          />
          <ControlButton
            title="Insert"
            icon="fa-file-import"
            // eslint-disable-next-line max-len
            onClick={() => onInsertPressed(id, title, sourceName, comment + engGuidesToStr(engGuides))}
            isViewed
          />
          </div>
        </div>
        {title && comment && (
          <SuggestionComment
            id={id}
            title={title}
            sourceName={sourceName}
            comment={comment}
            engGuides={engGuides}
            onCopyPressed={onCopyPressed}
            onInsertPressed={onInsertPressed}
            isCopied={isCopied}
            isViewed
            sourceUrl={sourceUrl}
            sourceIcon={sourceIcon}
          />
        )}
        <div className="dashed-line" />
        <div className="sema-is-flex">
          {tags?.map((tag, index) => <div key={index} className="tags-container">
            {tag.label}
          </div>)}
        </div>
      </>
    );
  };
  const wrapperWidth = '100%';
  return (
    <div
      className="sema-is-flex overflow-hidden"
      style={isDetailedView ? {
        width: wrapperWidth,
        maxHeight: '200px',
      } : {
        width: wrapperWidth,
        height: '313px',
      }}
    >
      <div
        className="sema-is-flex sema-is-flex-direction-column sema-is-relative"
        style={{
          minWidth: wrapperWidth,
          overflowY: 'auto',
        }}
      >
        <AllComments />
      </div>
      <div
        className={`sema-is-flex sema-is-flex-direction-column sema-is-relative view-suggestion-modal ${getActiveThemeClass()}`}
        style={{
          minWidth: wrapperWidth,
          top: 0,
          left: isCommentDetailsVisible ? '-100%' : '0%',
          transition: '.15s ease-out',
          zIndex: 2,
          overflowY: 'auto',
        }}
      >
        <Comment />
      </div>
    </div>
  );
}

export default CommentsList;
