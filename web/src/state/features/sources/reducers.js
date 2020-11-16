import * as types from './types';
import { upsert } from '../../../utils';

const initialState = {
  isFetching: false,
  data: [],
  selectedSource: {},
  selectedSourceRepos: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_CREATE_SOURCE:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_CREATE_SOURCE_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: upsert(state.data, action.source._id, action.source),
      error: {},
    };
  case types.REQUEST_CREATE_SOURCE_ERROR:
    return {
      ...state,
      isFetching: false,
      data: {},
      error: action.errors,
    };
  case types.REQUEST_FETCH_SOURCES:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_SOURCES_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: action.sources,
      selectedSource: action.sources[0], // TEMP - Until selection is avaiable
      error: {},
    };
  case types.REQUEST_FETCH_SOURCES_ERROR:
    return {
      ...state,
      isFetching: false,
      data: {},
      error: action.errors,
    };
  case types.REQUEST_FETCH_SOURCE_REPOS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_SOURCE_REPOS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      selectedSourceRepos: action.repositories,
      error: {},
    };
  case types.REQUEST_FETCH_SOURCE_REPOS_ERROR:
    return {
      ...state,
      isFetching: false,
      selectedSourceRepos: [],
      error: action.errors,
    };
  default:
    return state;
  }
};

export default reducer;
