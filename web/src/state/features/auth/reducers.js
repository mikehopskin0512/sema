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
      user: {},
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
  case types.RECEIVE_REFRESH_TOKEN_SUCCESS:
    return {
      ...state,
      isFetching: false,
      isAuthenticated: true,
      token: action.token,
      error: {},
    };
  case types.REQUEST_REGISTRATION_SUCCESS:
    return {
      ...state,
      isFetching: false,
      isAuthenticated: false, // Don't authenticate them until after verification
      token: action.token,
      user: action.user,
      error: {},
    };
  case types.REQUEST_REGISTRATION_ERROR:
    return {
      ...state,
      isFetching: false,
      isAuthenticated: false,
      error: action.errors,
    };
  case types.RECEIVE_REFRESH_TOKEN_ERROR:
    return {
      ...state,
      isFetching: false,
      isAuthenticated: false,
      error: action.errors,
    };
  case types.USER_NOT_VERIFIED:
    return {
      ...state,
      isFetching: false,
      isAuthenticated: false,
      user: action.user,
    };
  case types.SET_USER:
    return {
      ...state,
      user: action.user,
    };
  default:
    return state;
  }
};

export default reducer;
