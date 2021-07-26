import * as types from './types';
import { upsert } from '../../../utils';

const initialState = {
  isFetching: false,
  data: {
    repository: {},
    repositories: [],
  },

};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_CREATE_REPO:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_CREATE_REPO_SUCCESS:
    return {
      ...state,
      isFetching: false,
      // data: upsert(state.data, action.source._id, action.source),
      error: {},
    };
  case types.REQUEST_CREATE_REPO_ERROR:
    return {
      ...state,
      isFetching: false,
      data: {},
      error: action.errors,
    };
  case types.REQUEST_FETCH_REPOS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_REPOS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        repositories: action.repositories,
        repository: state.data.repository,
      },
      error: {},
    };
  case types.REQUEST_FETCH_REPOS_ERROR:
    return {
      ...state,
      isFetching: false,
      data: {},
      error: action.errors,
    };
  case types.REQUEST_FETCH_REPO:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_REPO_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        repositories: state.data.repositories,
        repository: action.repository,
      },
      error: {},
    };
  case types.REQUEST_FETCH_REPO_ERROR:
    return {
      ...state,
      isFetching: false,
      data: {
        repositories: state.data.repositories,
        repository: action.repository,
      },
      error: action.errors,
    };
  case types.REQUEST_GET_USER_REPOS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_GET_USER_REPOS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        repositories: action.repositories,
        repository: state.data.repository,
      },
      error: {},
    };
  case types.REQUEST_GET_USER_REPOS_ERROR:
    return {
      ...state,
      isFetching: false,
      data: {
        repositories: action.repositories,
        repository: state.data.repository,
      },
      error: action.errors,
    };
  case types.REQUEST_FILTER_SEMA_REPOS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FILTER_SEMA_REPOS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        repositories: action.repositories,
        repository: state.data.repository,
      },
      error: {},
    };
  case types.REQUEST_FILTER_SEMA_REPOS_ERROR:
    return {
      ...state,
      isFetching: false,
      data: {
        repositories: action.repositories,
        repository: state.data.repository,
      },
      error: action.errors,
    };
  default:
    return state;
  }
};

export default reducer;
