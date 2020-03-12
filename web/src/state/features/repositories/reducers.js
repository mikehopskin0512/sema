import * as types from './types';

const initialState = {
  isFetching: false,
  data: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_REPOSITORIES:
    return {
      ...state,
      isFetching: true,
    };
  case types.RECEIVE_REPOSITORIES:
    return {
      ...state,
      isFetching: false,
      data: action.repositories,
      error: {},
    };
  case types.REQUEST_REPOSITORIES_ERROR:
    return {
      ...state,
      isFetching: false,
      data: [],
      error: action.error,
    };
  default:
    return state;
  }
};

export default reducer;
