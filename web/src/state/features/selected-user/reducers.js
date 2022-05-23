import * as types from './types';

const initialState = {
  user: {},
  isFetching: false,
};

const reducer = (state = initialState, action) => {
  // console.log("reducer -> action", action.type, action)
  switch (action.type) {
  case types.REQUEST_FETCH_USER:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_USER_SUCCESS:
    return {
      ...state,
      isFetching: false,
      user: action.user,
      error: {},
    };
  case types.REQUEST_FETCH_USER_ERROR:
    return {
      ...state,
      isFetching: false,
      users: [],
      error: action.errors,
    };
  default:
    return state;
  }
};

export default reducer;
