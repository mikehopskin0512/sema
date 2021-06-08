import * as types from './types';
import { upsert } from '../../../utils';

const initialState = {
  users: [],
  isFetching: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_UPDATE_USER_AVAILABLE_INVITATIONS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_UPDATE_USER_AVAILABLE_INVITATIONS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      error: {},
    };
  case types.REQUEST_UPDATE_USER_AVAILABLE_INVITATIONS_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_FETCH_USERS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_USERS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      users: action.users,
      error: {},
    };
  case types.REQUEST_FETCH_USERS_ERROR:
    return {
      ...state,
      isFetching: false,
      users: [],
      error: action.errors,
    };
  case types.UPDATE_USER_STATUS:
    return {
      ...state,
      isFetching: true,
    };
  case types.UPDATE_USER_STATUS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      error: {},
    };
  case types.UPDATE_USER_STATUS_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
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
