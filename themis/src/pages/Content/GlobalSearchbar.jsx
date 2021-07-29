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
  const {
    isOpen, openFor, data, position, isLoading,
  } = state[
    GLOBAL_SEMA_SEARCH_ID
  ];

  const { user } = state;

  return {
    isSearchModalVisible:
      isOpen && (openFor ? openFor === ownProps.activeElementId : true),
    data,
    position,
    isLoading,
    commentBox: ownProps.commentBox,
    mirror: ownProps.mirror,
    // eslint-disable-next-line no-underscore-dangle
    userId: user?._id,
  };
};

const mapDispatchToProps = (dispatch) => ({
  toggleSearchModal: () => dispatch(toggleGlobalSearchModal()),
  toggleIsLoading: (isLoading) => dispatch(toggleGlobalSearchLoading({ isLoading })),
  onGlobalSearchInputChange: (value) => dispatch(onGlobalSearchInputChange({ data: value })),
});

const GlobalSearchbar = (props) => {
  const [searchResults, setSearchResults] = useState([]);

  const onInputChanged = (event) => {
    event.preventDefault();
    const { value } = event.target;
    props.onGlobalSearchInputChange(value);
  };

  const onCopyPressed = (id, suggestion) => {
    const { value } = props.commentBox;
    props.commentBox.value = `${value}\n${suggestion}\n`;
    setSearchResults([]);
    props.toggleSearchModal();

    props.commentBox.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const onCrossPressed = (event) => {
    event.preventDefault();
    props.onGlobalSearchInputChange('');
    setSearchResults([]);
    props.toggleSearchModal();
  };

  const getSemaSuggestions = () => {
    if (!props.isLoading) {
      props.toggleIsLoading(true);
    }
    const URL = `${SUGGESTION_URL}${props.data}&user=${props.userId}`;
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data?.searchResults?.result || []);
        if (props.isLoading) {
          props.toggleIsLoading(false);
        }
        // props.toggleSearchModal();
      });
  };

  const handleKeyPress = (event) => {
    const charCode = typeof event.which === 'number' ? event.which : event.keyCode;
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

  const containerClasses = `sema-dropdown${
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
              />
              <span className="sema-icon sema-is-small sema-is-left">
                <i className="fas fa-search" />
              </span>
            </div>
          </div>
        </div>
        <div className="sema-dropdown-menu suggestion-modal" role="menu">
          <div className="sema-dropdown-content">
            <div className="sema-dropdown-item">
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
