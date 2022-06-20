import * as types from './types';

const initialState = {
  isFetching: false,
  data: {
    smartComments: [],
  }
};

const reducer = (state = initialState, action) => {

  switch (action.type) {
  case types.REQUEST_SEARCH_REPO_SMART_COMMENTS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_SEARCH_REPO_SMART_COMMENTS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        smartComments: action.overview.smartComments,
      },
      error: {},
    };
  case types.REQUEST_SEARCH_REPO_SMART_COMMENTS_ERROR:
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
