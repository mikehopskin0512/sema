import { format, subDays } from 'date-fns';
import { YEAR_MONTH_DAY_FORMAT } from '../../../utils/constants';
import * as types from './types';

// Dates for default filters
const today = format(new Date(), YEAR_MONTH_DAY_FORMAT);
const weekAgo = format(subDays(new Date(), 7), YEAR_MONTH_DAY_FORMAT);

const initialState = {
  isFetching: false,
  data: {},
  error: {},
  contributors: [],
  fileTypes: [],
  repositories: [],
  showFilters: true,
  currentFilters: {
    param_z_date_end: today,
    param_z_date_start: weekAgo,
    param_z_developers: [],
    param_z_fileTypes: [],
    param_z_repositories: [],
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_CREATE_ORG:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_CREATE_ORG_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: action.organization,
      error: {},
    };
  case types.REQUEST_CREATE_ORG_ERROR:
    return {
      ...state,
      isFetching: false,
      data: {},
      error: action.errors,
    };
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
  case types.REQUEST_CONTRIBUTORS:
    return {
      ...state,
      isFetching: true,
    };
  case types.RECEIVE_CONTRIBUTORS:
    return {
      ...state,
      isFetching: false,
      contributors: action.users,
      error: {},
    };
  case types.REQUEST_CONTRIBUTORS_ERROR:
    return {
      ...state,
      isFetching: false,
      contributors: [],
      error: action.error,
    };
  case types.RECEIVE_FILTERS:
    return {
      ...state,
      isFetching: false,
      currentFilters: action.params,
    };
  case types.RESET_FILTERS:
    return {
      ...state,
      isFetching: false,
      currentFilters: initialState.currentFilters,
    };
  case types.TOGGLE_FILTERS:
    return {
      ...state,
      showFilters: action.showFilters,
    };
  default:
    return state;
  }
};

export default reducer;
