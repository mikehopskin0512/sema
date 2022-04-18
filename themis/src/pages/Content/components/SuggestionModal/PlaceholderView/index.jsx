import React from 'react';
import { getActiveTheme } from '../../../../../../utils/theme';
import { PLACEHOLDER_ICON } from '../constants.ts';

function PlaceholderView() {
  const activeTheme = getActiveTheme().toUpperCase();
  return (
    <div className="sema-comment-placeholder suggested-snippets-ph">
      <img
        className="sema-mb-5"
        src={PLACEHOLDER_ICON[activeTheme]}
        alt="comment placeholder"
      />
      <span className="suggested-snippets-ph--title sema-title sema-is-7 sema-is-block">
        Snippets will appear here.
      </span>
      <span className="suggested-snippets-ph--text sema-subtitle sema-is-7 sema-is-block">
        Type a few characters and we&apos;ll start searching right away.
      </span>
    </div>
  );
}

export default PlaceholderView;
