import React, { useState } from 'react';
import SuggestionModal from './SuggestionModal';
import { SUGGESTION_URL } from './constants';

function SearchBar({ commentBox }) {
  const [isDropdownVisible, toggleDropdown] = useState(false);
  const [searchValue, handleChange] = useState('');
  const [isLoading, toggleIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const onInputChanged = (event) => {
    event.preventDefault();
    const value = event.target.value;
    handleChange(value);
  };

  const onCopyPressed = (suggestion) => {
    let value = commentBox.value;
    value = value ? `${value}\n` : '';
    commentBox.value = `${value}${suggestion}`;
    setSearchResults([]);
    toggleDropdown(false);
  };

  const onCrossPressed = (event) => {
    event.preventDefault();
    handleChange('');
    setSearchResults([]);
    toggleDropdown(false);
  };

  const getSemaSuggestions = () => {
    toggleIsLoading(true);
    const URL = `${SUGGESTION_URL}${searchValue}`;
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data?.searchResults || []);
        toggleIsLoading(false);
        toggleDropdown(true);
      });
  };

  const handleKeyPress = (event) => {
    const charCode =
      typeof event.which == 'number' ? event.which : event.keyCode;
    if (charCode === 13) {
      // enter is pressed
      // show dropdown
      event.preventDefault();
      getSemaSuggestions();
    } else if (charCode === 27) {
      // esc is pressed
      // hide dropdown
      onCrossPressed(event);
    }
  };

  let containerClasses = `sema-dropdown${
    isDropdownVisible ? ' sema-is-active' : ''
  }`;

  const inputControlClasses = `sema-control sema-has-icons-left${
    isLoading ? ' sema-is-loading' : ''
  }`;

  return (
    <div className={containerClasses} style={{ width: '100%' }}>
      <div
        className="sema-dropdown-trigger"
        style={{
          width: '100%',
          display: 'flex',
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <div className="sema-field" style={{ flex: 1 }}>
          <div className={inputControlClasses}>
            <input
              className="sema-input"
              type="text"
              placeholder="Search.."
              value={searchValue}
              onChange={onInputChanged}
              onKeyDown={handleKeyPress}
            ></input>
            <span className="sema-icon sema-is-small sema-is-left">
              <i className="fas fa-search"></i>
            </span>
          </div>
        </div>
        <span
          className="sema-icon sema-pb-3"
          style={{ cursor: 'pointer' }}
          onClick={onCrossPressed}
        >
          <i className="fas fa-times"></i>
        </span>
      </div>
      <div
        className="sema-dropdown-menu suggestion-modal"
        id="dropdown-menu2"
        role="menu"
      >
        <div className="sema-dropdown-content">
          <div className="sema-dropdown-item">
            <SuggestionModal
              key={isLoading}
              onCopyPressed={onCopyPressed}
              searchResults={searchResults}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
