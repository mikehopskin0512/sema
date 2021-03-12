import React, { useState } from 'react';
import SuggestionModal from './SuggestionModal';

function SearchBar({ commentBox }) {
  const [isDropdownVisible, toggleDropdown] = useState(false);
  const [searchValue, handleChange] = useState('');

  const onInputChanged = (event) => {
    event.preventDefault();
    const value = event.target.value;
    handleChange(value);
  };

  const onCopyPressed = (suggestion) => {
    const value = commentBox.value;
    commentBox.value = `${value} ${suggestion}`;
    toggleDropdown(false);
  };

  const handleKeyPress = (event) => {
    const charCode =
      typeof event.which == 'number' ? event.which : event.keyCode;
    if (charCode === 13) {
      // enter is pressed
      // show dropdown
      event.preventDefault();
      toggleDropdown(true);
    } else if (charCode === 27) {
      // esc is pressed
      // hide dropdown
      event.preventDefault();
      toggleDropdown(false);
    }
  };

  let containerClasses = `sema-dropdown${
    isDropdownVisible ? ' sema-is-active' : ''
  }`;

  return (
    <div className={containerClasses}>
      <div className="sema-dropdown-trigger">
        <div className="sema-field">
          <div className="sema-control">
            <input
              className="sema-input"
              type="text"
              placeholder="Search.."
              value={searchValue}
              onChange={onInputChanged}
              onKeyDown={handleKeyPress}
            ></input>
          </div>
        </div>
      </div>
      <div
        className="sema-dropdown-menu suggestion-modal"
        id="dropdown-menu2"
        role="menu"
      >
        <div className="sema-dropdown-content">
          <div className="sema-dropdown-item">
            <SuggestionModal onCopyPressed={onCopyPressed} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
