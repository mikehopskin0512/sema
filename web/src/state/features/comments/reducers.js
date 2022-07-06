import * as types from './types';

const initialState = {
  isFetching: false,
  collection: {},
  collections: [],
  suggestedComments: [],
  smartComments: [],
  summary: {},
  overview: {},
  searchResults: [],
  pagination: {
    pageSize: 1,
    pageNumber: 1,
    totalPage: 0,
    total: 0,
    hasNextPage: false,
    hasPreviousPage: false
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.FETCH_COMMENT_COLLECTION:
    return {
      ...state,
      isFetching: true,
    };
  case types.FETCH_COMMENT_COLLECTION_SUCCESS:
    return {
      ...state,
      isFetching: false,
      collection: action.collection,
      error: {},
    };
  case types.FETCH_COMMENT_COLLECTION_ERROR:
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
      collections: action.payload,
      error: {},
    };
  case types.FETCH_USER_COLLECTIONS_ERROR:
    return {
      ...state,
      isFetching: false,
      collections: [],
    };
    case types.FETCH_USER_SUGGESTED_COMMENTS:
      return {
        ...state,
        isFetching: true,
        suggestedComments: [],
        error: {},
      }
    case types.FETCH_USER_SUGGESTED_COMMENTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        suggestedComments: action.payload,
        error: {},
      }
    case types.FETCH_USER_SUGGESTED_COMMENTS_ERROR:
      return {
        ...state,
        suggestedComments: [],
        isFetching: false,
      }
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
  case types.REQUEST_FILTER_REPO_SMART_COMMENTS:
    return {
      ...state,
      isFetching: true,
    }
  case types.REQUEST_FILTER_REPO_SMART_COMMENTS_SUCCESS:
    return {
        ...state,
        searchResults: action.results.smartComments,
        pagination: action.results.paginationData,
        isFetching: false,
      }
  case types.REQUEST_FILTER_REPO_SMART_COMMENTS_ERROR:
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
