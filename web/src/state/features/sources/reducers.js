import * as types from './types';
import { upsert } from '../../../utils';

const initialState = {
  isFetching: false,
  data: [],
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
      error: {},
    };
  case types.REQUEST_FETCH_SOURCES_ERROR:
    return {
      ...state,
      isFetching: false,
      data: {},
      error: action.errors,
    };
  default:
    return state;
  }
};

export default reducer;
