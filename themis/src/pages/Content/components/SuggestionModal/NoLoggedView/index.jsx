import React from 'react';
import { getActiveTheme } from '../../../../../../utils/theme';
import { SEMA_WEB_LOGIN } from '../../../constants';
import { PLACEHOLDER_ICON } from '../constants.ts';

function NoLoggedView() {
  const activeTheme = getActiveTheme().toUpperCase();
  return (
    <div className="sema-comment-placeholder sema-mb-5">
      <img
        className="sema-mb-5"
        src={PLACEHOLDER_ICON[activeTheme]}
        alt="comment placeholder"
      />
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
