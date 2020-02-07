import initialState from '../initialState';
import * as types from './types';

/* State shape
{
    details: product,
    list: [ product ],
}
*/

export default function auth(state = initialState.auth, action) {
  switch (action.type) {
  case types.AUTH_LOGIN_REQUEST:
    return {
      ...state,
      isFetching: true,
    };
  case types.AUTH_LOGIN_SUCCESS:
    return {
      ...state,
      isFetching: false,
      isAuthenticated: true,
      token: action.token,
      error: {},
    };
  case types.LOGIN_TOKEN_SUCCESS:
    return {
      ...state,
      isFetching: false,
      token: action.token,
      error: {},
    };
  case types.AUTH_LOGIN_FAILURE:
    return {
      ...state,
      isFetching: false,
      isAuthenticated: false,
      error: action.errors,
    };
  case types.REFRESH_TOKEN_REQUEST:
    return {
      ...state,
      isFetching: true,
    };
  case types.REFRESH_TOKEN_SUCCESS:
    return {
      ...state,
      isFetching: false,
      token: action.token,
      error: {},
    };
  case types.REFRESH_TOKEN_ERROR:
    return {
      ...state,
      isFetching: false,
      token: null,
      user: {},
      error: action.errors,
    };
  case types.AUTH_LOGOUT_SUCCESS:
    return {
      ...state,
      isAuthenticated: false,
      token: null,
      user: {},
      error: {},
    };
  case types.REQUEST_CURRENT_USER:
    return {
      ...state,
      isFetching: true,
    };
  case types.RECEIVE_CURRENT_USER:
    return {
      ...state,
      isFetching: false,
      isAuthenticated: true,
      user: action.data,
      error: {},
    };
  case types.REQUEST_CURRENT_USER_ERROR:
    return {
      ...state,
      isFetching: false,
      user: {},
      error: action.errors,
    };
  default:
    return state;
  }
}
