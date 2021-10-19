import React from 'react';

const loader = chrome.runtime.getURL('img/loader.png');

function LoadingView() {
  return (
    <div className="sema-m-6 sema-comment-placeholder">
      <img src={loader} alt="loader" />
      <div style={{ margin: '24px 8px' }}>
        <p className="sema-title sema-is-7 sema-is-block">
          We are working hard to find code examples for you...
        </p>
      </div>
    </div>
  );
}

export default LoadingView;
