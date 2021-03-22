import React, { useState } from 'react';
import { connect } from 'react-redux';
import SuggestionModal from './SuggestionModal';
import { SUGGESTION_URL } from './constants';

import { toggleSearchModal } from './modules/redux/action';

const mapStateToProps = (state, ownProps) => {
  const { semasearches } = state;
  const semaSearchState = semasearches[ownProps.id];
  return {
    isSearchModalVisible: semaSearchState.isSearchModalVisible,
    commentBox: ownProps.commentBox,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { id } = ownProps;
  return {
    toggleSearchModal: () => dispatch(toggleSearchModal({ id })),
  };
};

const SearchBar = (props) => {
  const [searchValue, handleChange] = useState('');
  const [isLoading, toggleIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const onInputChanged = (event) => {
    event.preventDefault();
    const value = event.target.value;
    handleChange(value);
  };

  const onCopyPressed = (suggestion) => {
    let value = props.commentBox.value;
    value = value ? `${value}\n` : '';
    props.commentBox.value = `${value}${suggestion}`;
    setSearchResults([]);
    props.toggleSearchModal();
  };

  const onCrossPressed = (event) => {
    event.preventDefault();
    handleChange('');
    setSearchResults([]);
    props.toggleSearchModal();
  };

  const getSemaSuggestions = () => {
    toggleIsLoading(true);
    const URL = `${SUGGESTION_URL}${searchValue}`;
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data?.searchResults || []);
        toggleIsLoading(false);
        props.toggleSearchModal();
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
    props.isSearchModalVisible ? ' sema-is-active' : ''
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
              className="sema-input sema-is-small"
              type="text"
              placeholder="Search comment library"
              value={searchValue}
              onChange={onInputChanged}
              onKeyDown={handleKeyPress}
            ></input>
            <span className="sema-icon sema-is-small sema-is-left">
              <i className="fas fa-search"></i>
            </span>
          </div>
        </div>
        {/*         <span
          className="sema-icon sema-pb-3"
          style={{ cursor: 'pointer' }}
          onClick={onCrossPressed}
        >
          <i className="fas fa-times"></i>
        </span> */}
      </div>
      <div className="sema-dropdown-menu suggestion-modal" role="menu">
        <div className="sema-dropdown-content">
          <div className="sema-dropdown-item">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div></div>
              <div
                className="sema-icon"
                style={{ cursor: 'pointer' }}
                onClick={onCrossPressed}
              >
                <i className="fas fa-times"></i>
              </div>
            </div>

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
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
