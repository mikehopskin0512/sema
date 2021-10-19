import React from 'react';
import { SEMA_WEB_LOGIN } from '../../../constants';

const commentPlaceholder = chrome.runtime.getURL('img/comment-placeholder.png');

function NoLoggedView() {
  return (
    <div className="sema-comment-placeholder sema-mb-5">
      <img className="sema-mb-5" src={commentPlaceholder} alt="comment placeholder" />
      <span className="sema-title sema-is-7 sema-is-block">
        Login to view smart comments
      </span>
      <a
        className="sema-button login-button"
        href={SEMA_WEB_LOGIN}
        target="_blank"
        rel="noreferrer"
      >
        Log in to Sema
      </a>
    </div>
  );
}

export default NoLoggedView;
