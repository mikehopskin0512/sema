import React from 'react';
import codeIcon from '../../assets/img/codelines.png';
import logo from '../../assets/img/sema-logo.png';
// TODO: should include it in the project directly or make sema-custom at a common place for all?
import '../../assets/css/all.min.css';
import '../Content/styles/sema-custom.css';
import './Popup.css';

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
          <i className="fas fa-tag"></i>
          <span className="">Join our Waitlist with Github</span>
        </button>
        <p className="already-account">Already have an account?</p>
        <button>
          <span></span>
          <span>Sign in with Github</span>
        </button>
      </div>
    </div>
  );
};

export default Popup;
