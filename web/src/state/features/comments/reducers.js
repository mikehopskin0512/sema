import * as types from './types';

const initialState = {
  isFetching: false,
  collection: {},
  comments: [],
  smartComments: [],
  summary: {},
  overview: {},
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
  case types.REQUEST_FETCH_SMART_COMMENTS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_SMART_COMMENTS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      smartComments: action.smartComments
    };
  case types.REQUEST_FETCH_SMART_COMMENTS_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.error
    };
  case types.REQUEST_FETCH_SMART_COMMENT_SUMMARY:
    return {
      ...state,
      isFetching: true,
    }
  case types.REQUEST_FETCH_SMART_COMMENT_SUMMARY_SUCCESS:
    return {
      ...state,
      summary: action.summary,
      smartComments: action.summary.smartComments,
      isFetching: false,
    }
  case types.REQUEST_FETCH_SMART_COMMENT_SUMMARY_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.error
    }
  case types.REQUEST_FETCH_SMART_COMMENT_OVERVIEW:
    return {
      ...state,
      isFetching: true,
    }
  case types.REQUEST_FETCH_SMART_COMMENT_OVERVIEW_SUCCESS:
    return {
      ...state,
      overview: action.overview,
      isFetching: false,
    }
  case types.REQUEST_FETCH_SMART_COMMENT_OVERVIEW_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.error
    }
  default:
    return state;
  }
};

export default reducer;
