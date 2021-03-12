import React, { useState } from 'react';
import SuggestionModal from './SuggestionModal';

function SearchBar() {
  const [isDropdownVisible, toggleDropdown] = useState(false);
  const [searchValue, handleChange] = useState('');

  const onInputChanged = (event) => {
    const value = event.target.value;
    handleChange(value);
    if (value.length >= 3 && !isDropdownVisible) {
      toggleDropdown(true);
    } else if (value.length < 3 && isDropdownVisible) {
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
            ></input>
          </div>
        </div>
      </div>
      <div className="sema-dropdown-menu" id="dropdown-menu2" role="menu">
        <div className="sema-dropdown-content">
          <div className="sema-dropdown-item">
            <SuggestionModal
              searchValue={searchValue}
              onInputChanged={onInputChanged}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
