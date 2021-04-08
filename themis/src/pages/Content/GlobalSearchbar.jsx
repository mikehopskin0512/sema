import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SuggestionModal from './SuggestionModal';
import { SUGGESTION_URL, GLOBAL_SEMA_SEARCH_ID } from './constants';

import {
  toggleGlobalSearchModal,
  toggleGlobalSearchLoading,
  onGlobalSearchInputChange,
} from './modules/redux/action';

const mapStateToProps = (state, ownProps) => {
  const { isOpen, openFor, data, position, isLoading } = state[
    GLOBAL_SEMA_SEARCH_ID
  ];
  return {
    isSearchModalVisible:
      isOpen && (openFor ? openFor === ownProps.activeElementId : true),
    data,
    position,
    isLoading,
    commentBox: ownProps.commentBox,
    mirror: ownProps.mirror,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSearchModal: () => dispatch(toggleGlobalSearchModal()),
    toggleIsLoading: (isLoading) =>
      dispatch(toggleGlobalSearchLoading({ isLoading })),
    onGlobalSearchInputChange: (value) =>
      dispatch(onGlobalSearchInputChange({ data: value })),
  };
};

const GlobalSearchbar = (props) => {
  const [searchResults, setSearchResults] = useState([]);

  const onInputChanged = (event) => {
    event.preventDefault();
    const value = event.target.value;
    props.onGlobalSearchInputChange(value);
  };

  const onCopyPressed = (suggestion) => {
    let value = props.commentBox.value;
    props.commentBox.value = `${value}\n\`\`\`\n${suggestion}\n\`\`\``;
    // directly changing the value will not trigger "oninput" event
    // so directly call the mirror callback for oninput
    props.mirror._onInput();
    setSearchResults([]);
    props.toggleSearchModal();
  };

  const onCrossPressed = (event) => {
    event.preventDefault();
    props.onGlobalSearchInputChange('');
    setSearchResults([]);
    props.toggleSearchModal();
  };

  const getSemaSuggestions = () => {
    !props.isLoading && props.toggleIsLoading(true);
    const URL = `${SUGGESTION_URL}${props.data}`;
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data?.searchResults || []);
        if (props.isLoading) {
          props.toggleIsLoading(false);
        }
        // props.toggleSearchModal();
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
    props.isLoading ? ' sema-is-loading' : ''
  }`;

  useEffect(() => {
    if (props.isLoading) {
      getSemaSuggestions();
    }
  });

  let elem = null;

  if (props.isSearchModalVisible) {
    elem = (
      <div
        className={containerClasses}
        style={{
          position: 'absolute',
          width: '384px',
          top: props.position.top,
          left: props.position.left,
        }}
      >
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
                value={props.data}
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
                key={props.isLoading}
                onCopyPressed={onCopyPressed}
                searchResults={searchResults}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return elem;
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSearchbar);
