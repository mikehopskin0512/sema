import * as types from './types';

const initialState = {
  isFetching: false,
  data: [],
  error: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_CREATE_INVITE:
      return {
        ...state,
        isFetching: true,
      };
    case types.REQUEST_CREATE_INVITE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: {},
      };
    case types.REQUEST_CREATE_INVITE_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.errors,
      };
    case types.REQUEST_FETCH_INVITE:
      return {
        ...state,
        isFetching: true,
      };
    case types.REQUEST_FETCH_INVITE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.invitation,
        error: {},
      };
    case types.REQUEST_FETCH_INVITE_ERROR:
      return {
        ...state,
        isFetching: false,
        data: [],
        error: action.errors,
      };
    case types.REQUEST_GET_INVITES_BY_SENDER:
      return {
        ...state,
        isFetching: true,
      };
    case types.REQUEST_GET_INVITES_BY_SENDER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.invitation,
        error: {},
      };
    case types.REQUEST_GET_INVITES_BY_SENDER_ERROR:
      return {
        ...state,
        isFetching: false,
        data: [],
        error: action.errors,
      };
    case types.REQUEST_DELETE_INVITE:
      return {
        ...state,
        isFetching: true,
      };
    case types.REQUEST_DELETE_INVITE_SUCCESS:
      return {
        ...state,
        isFetching: false,
      };
    case types.REQUEST_DELETE_INVITE_ERROR:
      return {
        ...state,
        isFetching: false,
        data: [],
        error: action.errors,
      };
    case types.REQUEST_FETCH_INVITE_METRICS:
      return {
        ...state,
        isFetching: true,
      };
    case types.REQUEST_FETCH_INVITE_METRICS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        inviteMetrics: action.invitations,
        error: {},
      };
    case types.REQUEST_FETCH_INVITE_METRICS_ERROR:
      return {
        ...state,
        isFetching: false,
        inviteMetrics: {},
        error: action.errors,
      };
    default:
      return state;
  }
};

export default reducer;
