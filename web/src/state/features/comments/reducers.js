import * as types from './types';

const initialState = {
  isFetching: false,
  collection: {},
  comments: [],
  smartComments: [],
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
    };
  case types.REQUEST_GET_SMART_COMMENTS_BY_REPO:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_GET_SMART_COMMENTS_BY_REPO_SUCCESS:
    return {
      ...state,
      isFetching: false,
      smartComments: action.smartComments,
      error: {},
    };
  case types.REQUEST_GET_SMART_COMMENTS_BY_REPO_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  default:
    return state;
  }
};

export default reducer;
