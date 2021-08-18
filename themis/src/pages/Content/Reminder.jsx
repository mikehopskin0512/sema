import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const semaUIUrl = process.env.SEMA_UI_URL;

const logoUrl = chrome.runtime.getURL(
  'img/sema-logo.png',
);

const screenshot1 = chrome.runtime.getURL(
  'img/code-review-sample1.png',
);

const screenshot2 = chrome.runtime.getURL(
  'img/code-review-sample2.png',
);

const openSema = () => {
  window.open(semaUIUrl, '_blank');
};

const onCrossClicked = () => window.close();

const loggedOutElem = () => (
  <div className="reminder-container">
    <div className="reminder-header">
      <img src={logoUrl} alt="sema logo" />
      <FontAwesomeIcon
        onClick={onCrossClicked}
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
        onClick={openSema}
        type="button"
      >
        <FontAwesomeIcon icon={faGithub} style={{ width: '32px' }} />
        <span>
          Sign in with Github
        </span>
      </button>
      <a href={semaUIUrl}>Learn More</a>
    </div>
  </div>
);

const Reminder = () => loggedOutElem();
export default Reminder;
