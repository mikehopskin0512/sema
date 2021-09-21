import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash/function';
import SuggestionModal from './components/SuggestionModal';
import { SUGGESTION_URL, SEMA_WEB_LOGIN, SEMA_WEB_COLLECTIONS } from './constants';

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
    commentBox: ownProps.commentBox,
    searchValue: semaSearchState.searchValue,
    // eslint-disable-next-line no-underscore-dangle
    userId: user?._id,
    isLoggedIn: user?.isLoggedIn,
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
  const [isLoading, toggleIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const suggestionModalDropdownRef = useRef(null);

  const getSemaSuggestions = (value, userId) => {
    toggleIsLoading(true);
    const URL = `${SUGGESTION_URL}${value}&user=${userId}`;
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data?.searchResults?.result || []);
      })
      .finally(() => {
        props.toggleSearchModal({ isOpen: true });
        toggleIsLoading(false);
      });
  };

  const getSuggestionsDebounced = useRef(debounce(getSemaSuggestions, 500));

  const onInputChanged = (event) => {
    event.preventDefault();
    const { value } = event.target;
    props.handleChange(value);
    props.toggleSearchModal({ isOpen: false });
    if (value) {
      getSuggestionsDebounced.current(value, props.userId);
    } else {
      getSuggestionsDebounced.current.cancel();
    }
  };

  const onInsertPressed = (id, suggestion) => {
    const value = props.commentBox.value ? `${props.commentBox.value}\n` : '';
    // eslint-disable-next-line no-param-reassign
    props.commentBox.value = `${value}${suggestion}`;
    props.selectedSuggestedComments(id);
    setSearchResults([]);
    props.toggleSearchModal({ isOpen: false });
    props.onLastUsedSmartComment(suggestion);
    props.commentBox.dispatchEvent(new Event('change', { bubbles: true }));
    props.onTextPaste();
  };

  const renderPlaceholder = () => {
    const commentPlaceholder = chrome.runtime.getURL(
      'img/comment-placeholder.png',
    );
    const noResults = chrome.runtime.getURL('img/no-results.png');
    const loader = chrome.runtime.getURL('img/loader.png');
    if (isLoading) {
      return (
        <div className="sema-m-6 sema-comment-placeholder">
          <img src={loader} alt="loader" />
          <span className="sema-title sema-is-7 sema-is-block">
            We are working hard to find code examples for you...
          </span>
        </div>
      );
    } if (!props.isLoggedIn) {
      return (
        <div className="sema-comment-placeholder sema-mb-5">
          <img className="sema-mb-5" src={commentPlaceholder} alt="comment placeholder" />
          <span className="sema-title sema-is-7 sema-is-block">
            Login to view smart comments
          </span>
          <a
            className="sema-button login-button"
            href={SEMA_WEB_LOGIN}
            target="_blank"
            rel="noreferrer"
          >
            Log in to Sema
          </a>
        </div>
      );
    }
    if (props.searchValue.length > 0 && searchResults.length === 0) {
      // empty
      return (
        <div className="sema-comment-placeholder">
          <img className="sema-comment-placeholder--img" src={noResults} alt="no results" />
          <span className="sema-comment-placeholder--title">
            No Suggested Comments found :(
          </span>
          <a
            className="sema-comment-placeholder--link"
            href={SEMA_WEB_COLLECTIONS}
            target="_blank"
            rel="noopener noreferrer"
          >
            Manage your collections
          </a>
          <a
            className="sema-comment-placeholder--link"
            href={`https://www.google.com/search?q=${props.searchValue}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Try this search on Google
          </a>
        </div>
      );
    } if (props.searchValue.length === 0 && searchResults.length === 0) {
      return (
        <div className="sema-comment-placeholder">
          <img className="sema-mb-5" src={commentPlaceholder} alt="comment placeholder" />
          <span className="sema-title sema-is-7 sema-is-block">
            Suggested comments will appear here.
          </span>
          <span className="sema-subtitle sema-is-7 sema-is-block">
            Type a few characters and we&apos;ll start searching right away.
          </span>
        </div>
      );
    }
    return '';
  };

  const resetSearch = () => {
    props.handleChange('');
    setSearchResults([]);
    props.toggleSearchModal();
  };

  const handleKeyPress = (event) => {
    const isEscKey = event.keyCode === 27;
    const isEnterKey = event.keyCode === 13;

    if (isEscKey) {
      event.preventDefault();
      resetSearch();
    } else if (isEnterKey) {
      event.preventDefault();
    }
  };

  const { isSearchModalVisible, searchValue, isLoggedIn } = props;

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
            {renderPlaceholder()}
            {isLoggedIn && (
              <>
                <SuggestionModal
                  key={`${isSearchModalVisible}${isLoading}${searchValue}`}
                  onInsertPressed={onInsertPressed}
                  searchResults={searchResults}
                  // eslint-disable-next-line react/destructuring-assignment
                  onLastUsedSmartComment={props.onLastUsedSmartComment}
                />
                <div className="sema-dropdown-footer">
                  <div style={{ marginTop: 'auto' }}>
                    <a
                      href={SEMA_WEB_COLLECTIONS}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i
                        className="fas fa-cog"
                        style={{ color: '#56626E', fontSize: '16px' }}
                      />
                    </a>
                  </div>
                  <div className="sema-logo__alt">
                    <img
                      width={18}
                      className="sema-mr-1"
                      src={chrome.runtime.getURL('img/tray-logo.svg')}
                      alt="sema logo"
                    />
                    {' '}
                    Powered by Sema
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
