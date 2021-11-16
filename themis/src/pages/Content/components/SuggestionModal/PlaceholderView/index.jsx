import React from 'react';

function PlaceholderView() {
  const commentPlaceholder = chrome.runtime.getURL('img/comment-placeholder.png');
  return (
    <div className="sema-comment-placeholder">
      <img className="sema-mb-5" src={commentPlaceholder} alt="comment placeholder" />
      <span className="sema-title sema-is-7 sema-is-block">
        Suggested snippets will appear here.
      </span>
      <span className="sema-subtitle sema-is-7 sema-is-block">
        Type a few characters and we&apos;ll start searching right away.
      </span>
    </div>
  );
}

export default PlaceholderView;
