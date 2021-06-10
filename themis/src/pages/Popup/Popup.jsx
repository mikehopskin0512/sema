import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import codeIcon from '../../assets/img/codelines.png';
import logo from '../../assets/img/sema-logo.png';
import lines from '../../assets/img/Lines.png';
import './Popup.css';
// TODO: how common files be shared across?
import { WHOAMI } from '../Content/constants';
import jwt_decode from 'jwt-decode';

const semaUIUrl = process.env.SEMA_UI_URL;

const checkLoggedIn = (cb) => {
  chrome.runtime.sendMessage({ [WHOAMI]: WHOAMI }, function (response) {
    cb(response);
  });
};

const openSema = () => {
  window.open(semaUIUrl, '_blank');
};

const loggedOutElem = () => (
  <div
    className="popup-container"
    style={{
      width: '500px',
      height: '598px',
      backgroundImage: `url(${lines})`,
    }}
  >
    <div className="popup-header">
      <img className="popup-logo" src={logo} />
    </div>
    <div className="popup-hero">
      <p className="sema-login-details">
        Login required to activate the Sema Chrome Extension
      </p>
      <img src={codeIcon} />
      <button className="login-primary" onClick={openSema}>
        <FontAwesomeIcon icon={faGithub} className="github" />
        <span className="login-primary-content">
          Join our Waitlist with Github
        </span>
      </button>
      <div className="already-account">
        <span className="divider"></span>
        <p className="already-account-content">Already have an account?</p>
        <span className="divider"></span>
      </div>
      <button className="login-secondary" onClick={openSema}>
        <FontAwesomeIcon icon={faGithub} className="github" />
        <span className="login-secondary-content">Sign in with Github</span>
      </button>
    </div>
  </div>
);

const loggedInElem = (userDetails) => {
  const {
    user: { firstName },
  } = userDetails;
  return (
    <div
      className="popup-container"
      style={{
        width: '500px',
        height: '563px',
        backgroundImage: `url(${lines})`,
      }}
    >
      <div className="popup-header">
        <img className="popup-logo" src={logo} />
      </div>
      <div
        className="popup-hero"
        style={{
          justifyContent: 'start',
          marginTop: '40px',
          marginBottom: '60px',
        }}
      >
        <p
          className="sema-login-details"
          style={{ alignSelf: 'start', margin: '32px 0px 60px 34px' }}
        >
          Hi {firstName},
        </p>
        <img src={codeIcon} style={{ marginBottom: '47px' }} />
        <button className="login-primary" onClick={openSema}>
          <svg
            width="30"
            height="29"
            viewBox="0 0 30 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.9997 0C7.05438 0 0.608398 6.45309 0.608398 14.4072C0.608398 22.3613 7.05438 28.8144 14.9997 28.8144C22.9451 28.8144 29.3911 22.3613 29.3911 14.4072C29.3911 6.45309 22.9451 0 14.9997 0ZM7.91786 22.884L12.8779 4.44278H15.6356L10.6756 22.884H7.91786ZM23.755 16.1093L22.249 17.3289L19.8526 14.6082L17.3559 17.3289L15.7896 16.1763L17.7709 13.1675L14.5044 11.8876L15.0868 9.80361L18.534 10.7015L18.8218 7.27732H20.7764L21.0642 10.7015L24.3307 9.87062L25.0001 11.8876L21.767 13.1675L23.755 16.1093Z"
              fill="white"
            />
          </svg>
          <span className="login-primary-content">
            Visit the Sema Dashboard
          </span>
        </button>
      </div>
    </div>
  );
};

const Popup = () => {
  const [loggedInDetails, setLoggedInDetails] = useState({});

  useEffect(() => {
    checkLoggedIn(setLoggedInDetails);
  }, [loggedInDetails?.token]);

  const { token, isLoggedIn } = loggedInDetails;

  return isLoggedIn ? loggedInElem(jwt_decode(token)) : loggedOutElem();
};

export default Popup;
