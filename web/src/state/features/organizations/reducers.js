import { format, subDays } from 'date-fns';
import * as types from './types';

// Dates for default filters
const today = format(new Date(), 'yyyy-MM-dd');
const weekAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');

const initialState = {
  isFetching: false,
  data: {},
  error: {},
  developers: [],
  fileTypes: [],
  repositories: [],
  filters: {
    param_z_date_end: today,
    param_z_date_start: weekAgo,
    param_z_developers: [],
    param_z_filetypes: [],
    param_z_repositories: [],
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_FILETYPES:
    return {
      ...state,
      isFetching: true,
    };
  case types.RECEIVE_FILETYPES:
    return {
      ...state,
      isFetching: false,
      fileTypes: action.fileTypes,
      error: {},
    };
  case types.REQUEST_FILETYPES_ERROR:
    return {
      ...state,
      isFetching: false,
      fileTypes: [],
      error: action.error,
    };
  case types.REQUEST_REPOSITORIES:
    return {
      ...state,
      isFetching: true,
    };
  case types.RECEIVE_REPOSITORIES:
    return {
      ...state,
      isFetching: false,
      repositories: action.repositories,
      error: {},
    };
  case types.REQUEST_REPOSITORIES_ERROR:
    return {
      ...state,
      isFetching: false,
      repositories: [],
      error: action.error,
    };
  case types.REQUEST_USERS:
    return {
      ...state,
      isFetching: true,
    };
  case types.RECEIVE_USERS:
    return {
      ...state,
      isFetching: false,
      developers: action.users,
      error: {},
    };
  case types.REQUEST_USERS_ERROR:
    return {
      ...state,
      isFetching: false,
      developers: [],
      error: action.error,
    };
  case types.RECEIVE_FILTERS:
    return {
      ...state,
      isFetching: false,
      filters: action.params,
    };
  default:
    return state;
  }
};

export default reducer;
