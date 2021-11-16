import React from 'react';
import { SEMA_WEB_COLLECTIONS } from '../../../constants';

function NoResultsView({ searchValue }) {
  const noResults = chrome.runtime.getURL('img/no-results-light.svg');
  return (
    <div className="sema-comment-placeholder">
      <img className="sema-comment-placeholder--img" src={noResults} alt="no results" />
      <span className="sema-comment-placeholder--title">
        No Suggested Snippets found :(
      </span>
      <a
        className="sema-comment-placeholder--link"
        href={SEMA_WEB_COLLECTIONS}
        target="_blank"
        rel="noopener noreferrer"
      >
        Manage your collections
      </a>
      <a
        className="sema-comment-placeholder--link"
        href={`https://www.google.com/search?q=${searchValue}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Try this search on Google
      </a>
    </div>
  );
}

export default NoResultsView;
