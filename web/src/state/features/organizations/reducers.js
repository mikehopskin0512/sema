import * as types from './types';

const initialState = {
  isFetching: false,
  data: {},
  error: {},
  developers: [],
  fileTypes: [],
  repositories: [],
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
  default:
    return state;
  }
};

export default reducer;
