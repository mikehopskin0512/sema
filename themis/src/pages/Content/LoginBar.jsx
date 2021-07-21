import { SEMA_WEB_LOGIN } from "./constants";
import React from "react";

function LoginBar() {
  const logo = chrome.runtime.getURL('img/sema-logo.svg');
  return (
    <div className="sema-login-bar">
      <div className='sema-offline-badge'>
        <img src={logo} alt='sema logo' />
        <span className='sema-offline-label'>Offline</span>
      </div>
      <a href={SEMA_WEB_LOGIN} target="_blank" className='sema-login-link'>
        Reactivate
      </a>
    </div>
  )
}

export default LoginBar;
