import * as types from './types';

const initialState = {
  isFetching: false,
  smartComments: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
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
