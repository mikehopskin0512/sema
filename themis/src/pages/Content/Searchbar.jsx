import React, { useState } from 'react';
import { connect } from 'react-redux';
import SuggestionModal from './SuggestionModal';
import { SUGGESTION_URL } from './constants';

import {
  toggleSearchModal,
  addSuggestedComments,
  updatetSearchBarInputValue,
} from './modules/redux/action';

const mapStateToProps = (state, ownProps) => {
  const { semasearches } = state;
  const semaSearchState = semasearches[ownProps.id];
  return {
    isSearchModalVisible: semaSearchState.isSearchModalVisible,
    commentBox: ownProps.commentBox,
    searchValue: semaSearchState.searchValue,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { id } = ownProps;
  return {
    toggleSearchModal: () => dispatch(toggleSearchModal({ id })),
    selectedSuggestedComments: (suggestedComment) =>
      dispatch(addSuggestedComments({ id, suggestedComment })),
    handleChange: (searchValue) =>
      dispatch(updatetSearchBarInputValue({ id, searchValue })),
  };
};

const SearchBar = (props) => {
  const [isLoading, toggleIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const onInputChanged = (event) => {
    event.preventDefault();
    const value = event.target.value;
    props.handleChange(value);
  };

  const onCopyPressed = (id, suggestion) => {
    let value = props.commentBox.value;
    value = value ? `${value}\n` : '';
    props.commentBox.value = `${value}${suggestion}`;
    props.selectedSuggestedComments(id);
    setSearchResults([]);
    props.toggleSearchModal();

    props.commentBox.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const onCrossPressed = (event) => {
    event.preventDefault();
    props.handleChange('');
    setSearchResults([]);
    props.toggleSearchModal();
  };

  const getSemaSuggestions = () => {
    toggleIsLoading(true);
    const URL = `${SUGGESTION_URL}${props.searchValue}`;
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data?.searchResults?.result || []);
        toggleIsLoading(false);
        props.toggleSearchModal();
      });
  };

  const renderPlaceholder = () => {
    const commentPlaceholder = chrome.runtime.getURL("img/comment-placeholder.png");
    const noResults = chrome.runtime.getURL("img/no-results.png");
    const loader = chrome.runtime.getURL("img/loader.png");
    if (isLoading) {
      return <div className="sema-m-6 sema-comment-placeholder"><img src={loader} />
        <span className="sema-title sema-is-7 sema-is-block">We are working hard to find code examples for you...</span>
      </div>
    } else {
      if (props.searchValue.length > 0 && searchResults.length === 0) {
        // empty
        return <div className="sema-comment-placeholder"><img className="sema-mb-5" src={noResults} />
          <span className="sema-title sema-is-7 sema-is-block">No results :( We are still learning!</span>
          <span className="sema-subtitle sema-is-7 sema-is-block">Sorry, we don't have search result for this one. Try again soon - we've noted your query to improve our results.</span>
          <a className="sema-mt-2" href={`https://www.google.com/search?q=${props.searchValue}`} target="_blank" rel="noopener noreferrer">Try this search on Google</a>
        </div>
      } else if (props.searchValue.length === 0 && searchResults.length === 0) {
        return (<div className="sema-comment-placeholder"><img className="sema-mb-5" src={commentPlaceholder} />
          <span className="sema-title sema-is-7 sema-is-block">Suggested comments will appear here.</span>
          <span className="sema-subtitle sema-is-7 sema-is-block">Type a few characters and we'll start searching right away.</span>
        </div>)
      } else {
        return ""
      }
    }
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

  let containerClasses = `sema-dropdown${props.isSearchModalVisible ? ' sema-is-active' : ''}`;

  const inputControlClasses = `sema-control sema-has-icons-left${isLoading ? ' sema-is-loading' : ''}`;

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
              value={props.searchValue}
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
            {renderPlaceholder()}
            <SuggestionModal
              key={isLoading}
              onCopyPressed={onCopyPressed}
              searchResults={searchResults}
            />
          </div>
          <div className="sema-dropdown-footer sema-is-flex sema-is-justify-content-flex-end sema-is-align-items-center sema-mt-2">
            <span className="sema-is-pulled-right sema-is-flex sema-is-justify-content-center sema-is-align-items-center">
              <img className="sema-credit-img sema-mr-1" src={chrome.runtime.getURL("img/sema16.png")} /> Powered by Sema
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
