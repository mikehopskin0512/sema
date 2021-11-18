import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { fireAmplitudeEvent, detectURLChange, isPRPage } from '../../modules/content-util';
import { closeLoginReminder } from '../../modules/redux/action';
import { EVENTS, SEMA_LANDING_FAQ, SEMA_UI_URL } from '../../constants';
import { getActiveThemeClass } from '../../../../../utils/theme';

const lightModeLogoUrl = chrome.runtime.getURL(
  'img/logos/sema-logo.png',
);

const darkModeLogoUrl = chrome.runtime.getURL(
  'img/dark_mode_sema.png',
);

const screenshot1 = chrome.runtime.getURL(
  'img/code-review-sample1.png',
);

const screenshot2 = chrome.runtime.getURL(
  'img/code-review-sample2.png',
);

const openSemaDashboard = () => {
  fireAmplitudeEvent(EVENTS.CLICKED_LOGIN_TOASTER);
  window.open(SEMA_UI_URL, '_blank');
};

const LogOutToaster = () => {
  const dispatch = useDispatch();
  const { isReminderClosed } = useSelector((state) => state);
  const { isLoggedIn } = useSelector((state) => state.user);
  const [isActivePage, setActivePage] = useState(isPRPage());
  const isToasterActive = !isReminderClosed && !isLoggedIn && isActivePage;
  const activeTheme = getActiveThemeClass();
  const logoUrl = activeTheme === '' ? lightModeLogoUrl : darkModeLogoUrl;
  const closeReminder = () => dispatch(closeLoginReminder());

  useEffect(() => {
    const stopDetectURLChange = detectURLChange(() => {
      setActivePage(isPRPage);
    });
    return () => {
      stopDetectURLChange();
    };
  }, []);

  return (
    <div
      className="reminder-container"
      style={{ display: isToasterActive ? 'block' : 'none' }}
    >
      <div className="reminder-header">
        <img src={logoUrl} alt="sema logo" />
        <FontAwesomeIcon
          onClick={closeReminder}
          icon={faTimes}
          className="reminder-close"
        />
      </div>
      <div className="reminder-hero">
        <div className="reminder-screenshots-container">
          <img src={screenshot2} className="reminder-screenshot1" alt="code lines" />
          <img
            src={screenshot1}
            className="reminder-screenshot2"
            alt="code lines"
          />
        </div>
        <p>
          Please sign in to enable Smart Code Reviews
        </p>
        <button
          onClick={openSemaDashboard}
          type="button"
        >
          <FontAwesomeIcon icon={faGithub} style={{ width: '32px' }} />
          <span>
            Sign in with Github
          </span>
        </button>
        <a target="_blank" href={SEMA_LANDING_FAQ} rel="noreferrer">Have Questions?</a>
      </div>
    </div>
  );
};

export default LogOutToaster;
