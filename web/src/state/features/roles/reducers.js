import * as types from './types';

const initialState = {
  roles: [],
  isFetching: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.FETCH_ROLES:
    return {
      ...state,
      isFetching: true,
    };
  case types.FETCH_ROLES_SUCCESS:
    return {
      ...state,
      isFetching: true,
      roles: action.roles,
    };
  case types.FETCH_ROLES_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.UPDATE_USER_ROLE:
    return {
      ...state,
      isFetching: true,
    };
  case types.UPDATE_USER_ROLE_SUCCESS:
    return {
      ...state,
      isFetching: true,
    };
  case types.UPDATE_USER_ROLE_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REMOVE_USER_ROLE:
    return {
      ...state,
      isFetching: true,
    };
  case types.REMOVE_USER_ROLE_SUCCESS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REMOVE_USER_ROLE_ERROR:
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
