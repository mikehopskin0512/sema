import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';

import codeIcon from '../../assets/img/codelines.png';
import logo from '../../assets/img/sema-logo.png';
import lines from '../../assets/img/Lines.png';
import './Popup.css';
// TODO: how common files be shared across?
import { WHOAMI } from '../Content/constants';

const semaUIUrl = process.env.SEMA_UI_URL;

const checkLoggedIn = (callback) => {
  chrome.runtime.sendMessage({ [WHOAMI]: WHOAMI }, callback);
};

const openSema = () => {
  window.open(semaUIUrl, '_blank');
};

const onCrossClicked = () => window.close();

const loggedOutElem = () => (
  <div className="popup-hero">
    <p className="sema-login-details">
      Login required to activate
      <br />
      the Sema Chrome Extension
    </p>
    <img src={codeIcon} alt="code lines" />
    <button className="login-primary" onClick={openSema} type="button">
      <FontAwesomeIcon icon={faGithub} className="github" />
      <span className="login-primary-content">
        Join our Waitlist with GitHub
      </span>
    </button>
    <div className="already-account">
      <span className="divider" />
      <p className="already-account-content">Already have an account?</p>
      <span className="divider" />
    </div>
    <button className="login-secondary" onClick={openSema} type="button">
      <FontAwesomeIcon icon={faGithub} className="github" />
      <span className="login-secondary-content">Sign in with GitHub</span>
    </button>
  </div>
);

const loggedInElem = (userDetails) => {
  const { user = {} } = userDetails;
  // Temp fix for new JWT bug
  const { firstName = '' } = user;
  return (
    <div
      className="popup-hero"
      style={{
        justifyContent: 'start',
        marginTop: '40px',
      }}
    >
      <p
        className="sema-login-details"
        style={{ alignSelf: 'start', margin: '32px 0px 60px 34px' }}
      >
        Hi
        {' '}
        {firstName}
        ,
      </p>
      <img src={codeIcon} style={{ marginBottom: '47px' }} alt="code lines" />
      <button className="login-primary" onClick={openSema} type="button">
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
  );
};

const getView = (isLoggedIn, token) => {
  switch (isLoggedIn) {
    case undefined:
      return <div className="popup-hero">loading...</div>;
    case true:
      return loggedInElem(jwt_decode(token));
    default:
      return loggedOutElem();
  }
};

const Popup = () => {
  const [loggedInDetails, setLoggedInDetails] = useState({});
  const { token, isLoggedIn } = loggedInDetails;

  useEffect(() => {
    checkLoggedIn(setLoggedInDetails);
  }, []);

  return (
    <div
      className="popup-container"
      style={{
        width: '500px',
        height: '590px',
        backgroundImage: `url(${lines})`,
      }}
    >
      <div className="popup-header">
        <img className="popup-logo" src={logo} alt="logo" />
        <FontAwesomeIcon
          onClick={onCrossClicked}
          icon={faTimes}
          className="cross"
        />
      </div>
      {getView(isLoggedIn, token)}
    </div>
  );
};

export default Popup;
