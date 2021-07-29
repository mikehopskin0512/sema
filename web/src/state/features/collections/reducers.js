import * as types from './types';

const initialState = {
  isFetching: false,
  data: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_CREATE_COLLECTIONS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_CREATE_COLLECTIONS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: action.collections,
      error: {},
    };
  case types.REQUEST_CREATE_COLLECTIONS_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_FIND_COLLECTIONS_BY_AUTHOR:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FIND_COLLECTIONS_BY_AUTHOR_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: action.collections,
      error: {},
    };
  case types.REQUEST_FIND_COLLECTIONS_BY_AUTHOR_ERROR:
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
