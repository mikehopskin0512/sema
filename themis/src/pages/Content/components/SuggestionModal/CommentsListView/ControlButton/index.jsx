import React from 'react';

function ControlButton({ onClick, title, icon, isViewed = false }) {
  return (
    <button
      type="button"
      className={`sema-button sema-is-inverted sema-is-small ${isViewed ? 'viewed' : ''}`}
      style={{ border: 'none' }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
    >
      <span className={isViewed ? 'sema-icon viewed' : 'sema-icon'}>
        <i className={`fas ${icon}`} />
      </span>
      {title && <span className="buttonText">{title}</span>}
    </button>
  );
}

export default ControlButton;
