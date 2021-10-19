import React from 'react';
import { useSelector } from 'react-redux';
import CommentsListView from './CommentsListView';
import NoLoggedView from './NoLoggedView';
import NoResultsView from './NoResultsView';
import PlaceholderView from './PlaceholderView';
import LoadingView from './LoadingView';

function SuggestionModal({
  onInsertPressed,
  searchResults,
  onLastUsedSmartComment,
  isLoading,
  searchValue,
}) {
  const { isLoggedIn } = useSelector((state) => state.user);
  const isNoResults = searchResults.length === 0;
  const isNoValue = searchValue.length === 0;
  switch (true) {
    case !isLoggedIn:
      return <NoLoggedView />;
    case isNoValue:
      return <PlaceholderView />;
    case isLoading:
      return <LoadingView />;
    case isNoResults:
      return <NoResultsView searchValue={searchValue} />;
    default:
      return (
        <CommentsListView
          onLastUsedSmartComment={onLastUsedSmartComment}
          onInsertPressed={onInsertPressed}
          searchResults={searchResults}
        />
      );
  }
}

export default SuggestionModal;
