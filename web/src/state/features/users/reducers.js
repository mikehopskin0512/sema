import * as types from './types';

const initialState = {
  users: [],
  isFetching: false,
  analytic: {},
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
  case types.REQUEST_FETCH_ANALYTIC_DATA:
    return {
      ...state,
      isAnalyticFetching: true,
    };
    case types.REQUEST_FETCH_ANALYTIC_DATA_SUCCESS:
    return {
      ...state,
      analytic: action.data,
      isAnalyticFetching: false,
    };
  case types.REQUEST_FETCH_ANALYTIC_DATA_ERROR:
    return {
      ...state,
      isAnalyticFetching: false,
      error: action.errors,
    };
  default:
    return state;
  }
};

export default reducer;
