import * as types from './types';

const initialState = {
  isFetching: false,
  collection: {},
  // TODO: it's collections state - need to be refactored
  comments: [],
  suggestedComments: [],
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
  case types.FETCH_USER_COLLECTIONS:
    return {
      ...state,
      isFetching: true,
    };
  case types.FETCH_USER_COLLECTIONS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      comments: action.comments,
      error: {},
    };
  case types.FETCH_USER_COLLECTIONS_ERROR:
    return {
      ...state,
      isFetching: false,
      comments: [],
    };
    case FETCH_USER_SUGGESTED_COMMENTS:
      return {
        ...state,
        isFetching: true,
        suggestedComments: [],
        error: {},
      }
    case FETCH_USER_SUGGESTED_COMMENTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        suggestedComments: action.payload,
        error: {},
      }
    case FETCH_USER_SUGGESTED_COMMENTS_ERROR:
      return {
        ...state,
        suggestedComments: [],
        isFetching: false,
      }
  default:
    return state;
  }
};

export default reducer;
