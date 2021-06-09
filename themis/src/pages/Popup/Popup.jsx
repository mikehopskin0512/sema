import React from 'react';
import codeIcon from '../../assets/img/codelines.png';
import logo from '../../assets/img/sema-logo.png';
// TODO: should include it in the project directly or make sema-custom at a common place for all?
import '../Content/styles/sema-custom.css';
import './Popup.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const Popup = () => {
  return (
    <div className="popup-container">
      <div className="popup-header">
        <img className="popup-logo" src={logo} />
      </div>
      <div className="popup-hero">
        <p className="sema-login-details">
          Login required to activate Sema Chrome Extension
        </p>
        <img src={codeIcon} />
        <button className="login-primary">
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
        <button className="login-secondary">
          <FontAwesomeIcon icon={faGithub} className="github" />
          <span className="login-secondary-content">Sign in with Github</span>
        </button>
      </div>
    </div>
  );
};

export default Popup;
