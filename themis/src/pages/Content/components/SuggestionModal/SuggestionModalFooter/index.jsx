import React from 'react';
import { SEMA_WEB_COLLECTIONS } from '../../../constants';

function SuggestionModalFooter() {
  return (
    <div className="sema-dropdown-footer">
      <div>
        <a
          href={SEMA_WEB_COLLECTIONS}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i
            className="fas fa-cog"
            style={{ color: '#56626E', fontSize: '16px' }}
          />
        </a>
      </div>
      <div className="sema-logo__alt">
        <img
          width={18}
          className="sema-mr-1"
          src={chrome.runtime.getURL('img/tray-logo.svg')}
          alt="sema logo"
        />
        {' '}
        Powered by Sema
      </div>
    </div>
  );
}

export default SuggestionModalFooter;
