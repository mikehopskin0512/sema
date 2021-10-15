import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash/function';
import SuggestionModal from './components/SuggestionModal';
import { SUGGESTION_URL } from './constants';

import {
  toggleSearchModal,
  addSuggestedComments,
  updatetSearchBarInputValue,
  usedSmartComment,
} from './modules/redux/action';

const mapStateToProps = (state, ownProps) => {
  const { semasearches, user } = state;
  const semaSearchState = semasearches[ownProps.id];

  return {
    isSearchModalVisible: semaSearchState.isSearchModalVisible,
    searchValue: semaSearchState.searchValue,
    // eslint-disable-next-line no-underscore-dangle
    userId: user?._id,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { id } = ownProps;
  return {
    toggleSearchModal: ({ isOpen }) => dispatch(toggleSearchModal({ id, isOpen })),
    // eslint-disable-next-line max-len
    selectedSuggestedComments: (suggestedComment) => dispatch(addSuggestedComments({ id, suggestedComment })),
    handleChange: (searchValue) => dispatch(updatetSearchBarInputValue({ id, searchValue })),
    onLastUsedSmartComment: (payload) => dispatch(usedSmartComment(payload)),
  };
};

const SearchBar = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const suggestionModalDropdownRef = useRef(null);

  const { commentBox } = props;

  const getSemaSuggestions = (value, userId) => {
    setIsLoading(true);
    const URL = `${SUGGESTION_URL}${value}&user=${userId}`;
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data?.searchResults?.result || []);
        props.toggleSearchModal({ isOpen: true });
      })
      .catch(() => {
        props.toggleSearchModal({ isOpen: false });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getSuggestionsDebounced = useRef(debounce(getSemaSuggestions, 500));

  const onInputChanged = (event) => {
    event.preventDefault();
    const { value } = event.target;
    props.handleChange(value);
    // props.toggleSearchModal({ isOpen: false });
    if (value) {
      getSuggestionsDebounced.current(value, props.userId);
    } else {
      getSuggestionsDebounced.current.cancel();
      props.toggleSearchModal({ isOpen: false });
    }
  };

  const onInsertPressed = (id, suggestion) => {
    const value = commentBox.value ? `${commentBox.value}\n` : '';
    // eslint-disable-next-line no-param-reassign
    commentBox.value = `${value}${suggestion}`;
    props.selectedSuggestedComments(id);
    props.toggleSearchModal({ isOpen: false });
    props.onLastUsedSmartComment(suggestion);
    commentBox.dispatchEvent(new Event('change', { bubbles: true }));
    props.onTextPaste();
  };

  const resetSearch = () => {
    props.handleChange('');
    setSearchResults([]);
    props.toggleSearchModal({ isOpen: false });
  };

  const handleKeyPress = (event) => {
    const isEscKey = event.keyCode === 27;
    const isEnterKey = event.keyCode === 13;
    if (isEscKey) {
      event.preventDefault();
      resetSearch();
    } else if (isEnterKey) {
      event.preventDefault();
      props.toggleSearchModal({ isOpen: true });
    }
  };

  const { isSearchModalVisible, searchValue } = props;

  const containerClasses = `sema-dropdown${isSearchModalVisible ? ' sema-is-active' : ''
  }`;

  const inputControlClasses = `sema-control sema-has-icons-left${isLoading ? ' sema-is-loading' : ''
  }`;

  useEffect(() => {
    if (suggestionModalDropdownRef) {
      suggestionModalDropdownRef.current.scrollTop = 0;
    }
    // eslint-disable-next-line react/destructuring-assignment
  }, [props.isSearchModalVisible]);

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
            />
            <span className="sema-icon sema-is-small sema-is-left">
              <i className="fas fa-search" />
            </span>
          </div>
        </div>
      </div>
      <div
        ref={suggestionModalDropdownRef}
        className="sema-dropdown-menu suggestion-modal"
        role="menu"
      >
        <div className="sema-dropdown-content">
          <div className="sema-dropdown-item">
            <SuggestionModal
              searchValue={searchValue}
              isLoading={isLoading}
              key={`${isSearchModalVisible}${isLoading}${searchValue}`}
              onInsertPressed={onInsertPressed}
              searchResults={searchResults}
              // eslint-disable-next-line react/destructuring-assignment
              onLastUsedSmartComment={props.onLastUsedSmartComment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
