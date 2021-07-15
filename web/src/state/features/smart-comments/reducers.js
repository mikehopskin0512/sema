import * as types from './types';

const initialState = {
  userActivityMetrics: [],
  smartCommentMetrics: [],
  isFetching: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_USER_ACTIVITY_CHANGE_METRICS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_USER_ACTIVITY_CHANGE_METRICS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      userActivityMetrics: action.userActivityMetrics,
      error: {},
    };
  case types.REQUEST_USER_ACTIVITY_CHANGE_METRICS_ERROR:
    return {
      ...state,
      isFetching: false,
      userActivityMetrics: [],
      error: action.errors,
    };
  case types.REQUEST_FETCH_SHARE_OF_WALLET_METRICS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_SHARE_OF_WALLET_METRICS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      smartCommentMetrics: action.smartCommentMetrics,
      error: {},
    };
  case types.REQUEST_FETCH_SHARE_OF_WALLET_METRICS_ERROR:
    return {
      ...state,
      isFetching: false,
      smartCommentMetrics: [],
      error: action.errors,
    };
  default:
    return state;
  }
};

export default reducer;
