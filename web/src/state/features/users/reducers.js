import * as types from './types';

const initialState = {
  isFetching: false,
  data: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_USERS:
    return {
      ...state,
      isFetching: true,
    };
  case types.RECEIVE_USERS:
    return {
      ...state,
      isFetching: false,
      data: action.users,
      error: {},
    };
  case types.REQUEST_USERS_ERROR:
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
