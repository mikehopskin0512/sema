import * as types from './types';

const initialState = {
  suggestedComments: [],
  totalCount: 0,
  isFetching: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_FETCH_SUGGEST_COMMENTS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_SUGGEST_COMMENTS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      suggestedComments: action.suggestedComments,
      totalCount: action.totalCount,
      error: {},
    };
  case types.REQUEST_FETCH_SUGGEST_COMMENTS_ERROR:
    return {
      ...state,
      isFetching: false,
      suggestedComments: [],
      error: action.errors,
    };
  case types.REQUEST_CREATE_SUGGEST_COMMENT:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_CREATE_SUGGEST_COMMENT_SUCCESS:
    return {
      ...state,
      isFetching: false,
      suggestedComments: action.suggestedComments,
      totalCount: action.totalCount,
      error: {},
    };
  case types.REQUEST_CREATE_SUGGEST_COMMENT_ERROR:
    return {
      ...state,
      isFetching: false,
      suggestedComments: [],
      error: action.errors,
    };
  case types.REQUEST_UPDATE_SUGGEST_COMMENT:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_UPDATE_SUGGEST_COMMENT_SUCCESS:
    return {
      ...state,
      isFetching: false,
      error: {},
    };
  case types.REQUEST_UPDATE_SUGGEST_COMMENT_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_GET_SUGGEST_COMMENTS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_GET_SUGGEST_COMMENTS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      suggestedComments: action.suggestedComments,
      totalCount: action.totalCount,
      error: {},
    };
  case types.REQUEST_GET_SUGGEST_COMMENTS_ERROR:
    return {
      ...state,
      isFetching: false,
      suggestedComments: [],
      error: action.errors,
    };
  default:
    return state;
  }
};

export default reducer;
