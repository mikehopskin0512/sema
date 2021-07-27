import * as types from './types';

const initialState = {
  isFetching: false,
  collection: {},
  comments: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.FETCH_COLLECTION:
    return {
      ...state,
      isFetching: true,
    };
  case types.FETCH_COLLECTION_SUCCESS:
    return {
      ...state,
      isFetching: false,
      collection: action.collection,
      error: {},
    };
  case types.FETCH_COLLECTION_ERROR:
    return {
      ...state,
      isFetching: false,
      collection: {},
      error: action.errors,
    };
  case types.FETCH_SUGGESTED_COMMENTS:
    return {
      ...state,
      isFetching: true,
    };
  case types.FETCH_SUGGESTED_COMMENTS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      comments: action.comments,
      error: {},
    };
  case types.FETCH_SUGGESTED_COMMENTS_ERROR:
    return {
      ...state,
      isFetching: false,
      comments: [],
      error: action.errors,
    };
  default:
    return state;
  }
};

export default reducer;
