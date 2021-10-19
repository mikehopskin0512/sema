import React from 'react';

function ControlButton({ onClick, title, icon }) {
  return (
    <button
      type="button"
      className="sema-button sema-is-inverted sema-is-small"
      style={{ border: 'none' }}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
    >
      <span className="sema-icon">
        <i className={`fas ${icon}`} />
      </span>
      {title && <span>{title}</span>}
    </button>
  );
}

export default ControlButton;
