import * as types from './types';

const initialState = {
  users: [],
  isFetching: false,
  isUpdating: false,
  totalCount: 0,
  analytic: {},
  timeToValueMetric: [],
  totalTimeToValueMetricCount: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_UPDATE_USER_AVAILABLE_INVITATIONS:
    return {
      ...state,
      isUpdating: true,
    };
  case types.REQUEST_UPDATE_USER_AVAILABLE_INVITATIONS_SUCCESS:
    return {
      ...state,
      isUpdating: false,
      error: {},
    };
  case types.REQUEST_UPDATE_USER_AVAILABLE_INVITATIONS_ERROR:
    return {
      ...state,
      isUpdating: false,
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
      totalCount: action.totalCount,
      analytic: action.filters,
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
      isUpdating: true,
    };
  case types.UPDATE_USER_STATUS_SUCCESS:
    return {
      ...state,
      isUpdating: false,
      error: {},
    };
  case types.UPDATE_USER_STATUS_ERROR:
    return {
      ...state,
      isUpdating: false,
      error: action.errors,
    };
  case types.UPDATE_USER:
    return {
      ...state,
      isUpdating: true,
    };
  case types.UPDATE_USER_SUCCESS:
    return {
      ...state,
      isUpdating: false,
      error: {},
    };
  case types.UPDATE_USER_ERROR:
    return {
      ...state,
      isUpdating: false,
      error: action.errors,
    };
  case types.REQUEST_TIME_TO_VALUE_METRIC:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_TIME_TO_VALUE_METRIC_SUCCESS:
    return {
      ...state,
      isFetching: false,
      timeToValueMetric: action.metric,
      totalTimeToValueMetricCount: action.totalCount,
      error: {},
    };
  case types.REQUEST_TIME_TO_VALUE_METRIC_ERROR:
    return {
      ...state,
      isFetching: false,
      timeToValueMetric: [],
      error: action.errors,
    };
  default:
    return state;
  }
};

export default reducer;
