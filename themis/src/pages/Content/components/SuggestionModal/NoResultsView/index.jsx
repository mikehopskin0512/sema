import React from 'react';
import { getActiveTheme } from '../../../../../../utils/theme';
import { SEMA_WEB_COLLECTIONS } from '../../../constants';
import { NO_RESULTS_ICON } from './constants.ts';

function NoResultsView({ searchValue }) {
  const activeTheme = getActiveTheme().toUpperCase();
  return (
    <div className="sema-comment-placeholder no-results-ph">
      <img
        className="sema-comment-placeholder--img"
        src={NO_RESULTS_ICON[activeTheme]}
        alt="no results"
      />
      <span className="no-results-ph--title sema-comment-placeholder--title">
        No snippets found :(
      </span>
      <a
        className="no-results-ph--link sema-comment-placeholder--link"
        href={SEMA_WEB_COLLECTIONS}
        target="_blank"
        rel="noopener noreferrer"
      >
        Manage your collections
      </a>
      <a
        className="no-results-ph--link sema-comment-placeholder--link"
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
