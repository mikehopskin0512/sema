import * as types from './types';

const initialState = {
  isFetching: false,
  engGuides: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.FETCH_ENG_GUIDES:
    return {
      ...state,
      isFetching: true,
    };
  case types.FETCH_ENG_GUIDES_SUCCESS:
    return {
      ...state,
      isFetching: false,
      engGuides: action.engGuides,
      error: {},
    };
  case types.FETCH_ENG_GUIDES_ERROR:
    return {
      ...state,
      isFetching: false,
      engGuides: {},
      error: action.errors,
    };
  default:
    return state;
  }
};

export default reducer;
