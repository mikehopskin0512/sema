import * as types from './types';

const initialState = {
  tags: [],
  isFetching: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.FETCH_ALL_TAGS:
    return {
      ...state,
      isFetching: true,
    };
  case types.FETCH_ALL_TAGS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      tags: action.tags,
      error: {},
    };
  case types.FETCH_ALL_TAGS_ERROR:
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
