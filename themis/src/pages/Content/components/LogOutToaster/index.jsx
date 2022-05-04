import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { detectURLChange, isPRPage } from '../../modules/content-util';
import { closeLoginReminder } from '../../modules/redux/action';
import { SEGMENT_EVENTS, SEMA_LANDING_FAQ, SEMA_UI_URL } from '../../constants';
import { segmentReset, segmentTrack } from '../../modules/segment';
import { getActiveTheme } from '../../../../../utils/theme';
import { SEMA_LOGOUT_ICON, SEMA_LOGOUT_PLACEHOLDER } from './constants';

const LogOutToaster = () => {
  const dispatch = useDispatch();
  const { isReminderClosed } = useSelector((state) => state);
  const { isLoggedIn, id: userId } = useSelector((state) => state.user);
  const [isActivePage, setActivePage] = useState(isPRPage());
  const isToasterActive = !isReminderClosed && !isLoggedIn && isActivePage;
  const activeTheme = getActiveTheme().toUpperCase();
  const logoSemaUrl = SEMA_LOGOUT_ICON[activeTheme];
  const logoPlaceholder = SEMA_LOGOUT_PLACEHOLDER[activeTheme];
  const closeReminder = () => dispatch(closeLoginReminder());

  if (isToasterActive) {
    segmentReset();
  }

  useEffect(() => {
    const stopDetectURLChange = detectURLChange(() => {
      setActivePage(isPRPage);
    });
    return () => {
      stopDetectURLChange();
    };
  }, []);

  const openSemaDashboard = () => {
    segmentTrack(SEGMENT_EVENTS.CLICKED_LOGIN_TOASTER, userId);
    window.open(SEMA_UI_URL, '_blank');
  };

  return (
    <div
      className="no-login-modal-container reminder-container"
      style={{ display: isToasterActive ? 'block' : 'none' }}
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
          Sign back in to supercharge your
          {' '}
          <br />
          {' '}
          GitHub comments
        </p>

        <img src={logoPlaceholder} alt="Logout placeholder" />
        <button
          onClick={openSemaDashboard}
          type="no-login-modal-text-button button"
        >
          <FontAwesomeIcon icon={faGithub} style={{ width: '32px' }} />
          <span>
            Sign in with GitHub
          </span>
        </button>
        <a
          target="_blank"
          href={SEMA_LANDING_FAQ}
          rel="noreferrer"
          className="no-login-modal-link"
        >
          Learn more
        </a>
      </div>
    </div>
  );
};

export default LogOutToaster;
