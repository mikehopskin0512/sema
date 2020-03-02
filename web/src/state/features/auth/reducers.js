import * as types from './types';

const initialState = {
  isFetching: false,
  isAuthenticated: false,
  token: null,
  user: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.AUTHENTICATE_REQUEST:
    return {
      ...state,
      isFetching: true,
    };
  case types.AUTHENTICATE:
    return {
      ...state,
      isFetching: false,
      isAuthenticated: true,
      token: action.token,
      error: {},
    };
  case types.AUTHENTICATE_FAILURE:
    return {
      ...state,
      isFetching: false,
      isAuthenticated: false,
      error: action.errors,
    };
  case types.HYDRATE_USER:
    return {
      ...state,
      user: action.user,
    };
  case types.DEAUTHENTICATE:
    return {
      ...state,
      isAuthenticated: false,
      token: null,
      user: {},
      error: {},
    };
  default:
    return state;
  }
};

export default reducer;
