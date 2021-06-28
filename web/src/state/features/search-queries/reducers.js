import * as types from './types';

const initialState = {
  searchQueries: [],
  totalCount: 0,
  isFetching: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_FETCH_SEARCH_QUERIES:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_SEARCH_QUERIES_SUCCESS:
    return {
      ...state,
      isFetching: false,
      searchQueries: action.queries,
      totalCount: action.totalCount,
      error: {},
    };
  case types.REQUEST_FETCH_SEARCH_QUERIES_ERROR:
    return {
      ...state,
      isFetching: false,
      searchQueries: [],
      error: action.errors,
    };
  default:
    return state;
  }
};

export default reducer;
