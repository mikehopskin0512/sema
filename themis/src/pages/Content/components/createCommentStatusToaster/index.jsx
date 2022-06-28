import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { SEMA_LOGOUT_ICON, SEMA_LOGOUT_PLACEHOLDER } from './constants';
import { SEMA_CREATE_COMMENT_STATUS_ROOT_ID } from '../../constants';
import { getActiveTheme } from '../../../../../utils/theme';

const CreateCommentStatusToaster = () => {
  const activeTheme = getActiveTheme().toUpperCase();
  const logoSemaUrl = SEMA_LOGOUT_ICON[activeTheme];
  const logoPlaceholder = SEMA_LOGOUT_PLACEHOLDER[activeTheme];
  const closeReminder = () => {
    document.getElementById(SEMA_CREATE_COMMENT_STATUS_ROOT_ID).remove();
  }
  return (
    <div
      className="sema-create-comment-status-container"
      style={{ display: 'block' }}
    >
      <div className="reminder-header">
        <img src={logoSemaUrl} alt="sema logo" />
        <FontAwesomeIcon
          onClick={closeReminder}
          icon={faTimes}
          className="reminder-close"
        />
      </div>
      <div className="reminder-hero">
        <p className="no-login-modal-title">
          <span role="img" aria-label="hammer">🛠️</span>
          This needs a fix
        </p>

        <p className="no-login-modal-text">
          Failed to create Smart Comment!
        </p>

        <img src={logoPlaceholder} alt="Logout placeholder" />
      </div>
    </div>
  );
};

export default CreateCommentStatusToaster;
