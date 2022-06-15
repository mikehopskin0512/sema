import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash/function';
import ProfileSwitcher from './components/ProfileSwitcher';
import SuggestionModal from './components/SuggestionModal';
import { SEGMENT_EVENTS, SUGGESTION_URL } from './constants';
import { fetchOrganizations } from './modules/content-util';
import { segmentTrack } from './modules/segment';
import {
  toggleSearchModal,
  addSuggestedComments,
  updateSearchBarInputValue,
  usedSmartComment,
  updateOrganizations,
} from './modules/redux/action';

const SearchBar = ({ id, commentBox, onTextPaste }) => {
  const dispatch = useDispatch();
  const { isSearchModalVisible, searchValue } = useSelector((state) => state.semasearches[id]);
  const { user, selectedProfile } = useSelector((state) => state);
  const { isLoggedIn } = user;
  const toggleModal = ({ isOpen }) => dispatch(toggleSearchModal({ id, isOpen }));
  const onLastUsedSmartComment = (payload) => dispatch(usedSmartComment(payload));
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isDetailedView, changeIsDetailedView] = useState(false);
  const suggestionModalDropdownRef = useRef(null);

  const getSemaSuggestions = (value, profile) => {
    setIsLoading(true);
    const organizationQuery = profile._id ? `&organization=${profile._id}` : '';
    const URL = `${SUGGESTION_URL}${value}&user=${user?._id}${organizationQuery}`;
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data?.searchResults?.result || []);
        toggleModal({ isOpen: true });
      })
      .catch(() => {
        toggleModal({ isOpen: false });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getSuggestionsDebounced = useRef(debounce(getSemaSuggestions, 500));

  const onInputChanged = (event) => {
    event.preventDefault();
    const { value } = event.target;
    dispatch(updateSearchBarInputValue({ id, searchValue: value }));
    if (value) {
      getSuggestionsDebounced.current(value, selectedProfile);
    } else {
      getSuggestionsDebounced.current.cancel();
    }
  };

  const onInsertPressed = (suggestedComment, title, sourceName, suggestion) => {
    const value = commentBox.value ? `${commentBox.value}\n` : '';
    // eslint-disable-next-line no-param-reassign
    commentBox.value = `${value}${suggestion}`;
    dispatch(addSuggestedComments({ id, suggestedComment }));
    toggleModal({ isOpen: false });
    onLastUsedSmartComment(suggestion);
    commentBox.dispatchEvent(new Event('change', { bubbles: true }));
    onTextPaste();
    segmentTrack(SEGMENT_EVENTS.INSERTED_SNIPPET, user._id, {
      comment_source: sourceName,
      comment_used: title,
    });
  };

  const resetSearch = () => {
    dispatch(updateSearchBarInputValue({ id, searchValue: '' }));
    setSearchResults([]);
    toggleModal({ isOpen: false });
  };

  const handleKeyPress = (event) => {
    const isEscKey = event.keyCode === 27;
    const isEnterKey = event.keyCode === 13;
    if (isEscKey) {
      event.preventDefault();
      resetSearch();
    } else if (isEnterKey) {
      event.preventDefault();
      toggleModal({ isOpen: true });
    }
  };

  useEffect(() => {
    if (suggestionModalDropdownRef) {
      suggestionModalDropdownRef.current.scrollTop = 0;
    }
  }, [isSearchModalVisible]);
  useEffect(() => {
    if (searchValue) {
      getSuggestionsDebounced.current(searchValue, selectedProfile);
    }
  }, [selectedProfile]);
  useEffect(() => {
    if (isLoggedIn) {
      fetchOrganizations().then((organizations) => {
        dispatch(updateOrganizations(organizations));
      });
    }
  }, [isLoggedIn]);

  return (
    <div>
      <div className="sema-is-flex sema-is-flex-wrap-nowrap sema-is-align-items-center">
        <div
          className={`sema-control sema-mr-4 sema-has-icons-left${
            isLoading ? ' sema-is-loading' : ''
          }`}
          style={{ width: '100%' }}
        >
          <input
            className="sema-input sema-is-small"
            type="text"
            placeholder="Search Snippet library"
            value={searchValue}
            onChange={onInputChanged}
            onKeyDown={handleKeyPress}
          />
          <span className="sema-icon sema-is-small sema-is-left">
            <i className="fas fa-search" />
          </span>
        </div>
        {isLoggedIn && (
          <ProfileSwitcher />
        )}
      </div>
      <div
        className={`sema-dropdown sema-is-flex ${
          isSearchModalVisible ? 'sema-is-active' : ''
        }`}
        style={{ width: '100%' }}
      >
        <div
          ref={suggestionModalDropdownRef}
          className={
            isDetailedView
              ? 'sema-dropdown-menu suggestion-modal view-mode'
              : 'sema-dropdown-menu suggestion-modal'
          }
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
                onLastUsedSmartComment={onLastUsedSmartComment}
                changeIsDetailedView={changeIsDetailedView}
                isDetailedView={isDetailedView}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
