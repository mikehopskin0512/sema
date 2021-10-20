import * as types from './types';

const initialState = {
  tags: [],
  isFetching: false,
  tag: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.FETCH_ALL_TAGS:
    return {
      ...state,
      isFetching: true,
    };
  case types.FETCH_ALL_TAGS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      tags: action.tags,
      error: {},
    };
  case types.FETCH_ALL_TAGS_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.CREATE_NEW_TAG:
    return {
      ...state,
      isFetching: true,
    };
  case types.CREATE_NEW_TAG_SUCCESS:
    return {
      ...state,
      isFetching: false,
      error: {},
    };
  case types.CREATE_NEW_TAG_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.FETCH_TAG_BY_ID:
    return {
      ...state,
      isFetching: true,
    };
  case types.FETCH_TAG_BY_ID_SUCCESS:
    return {
      ...state,
      isFetching: false,
      tag: action.tag,
      error: {},
    };
  case types.FETCH_TAG_BY_ID_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REMOVE_TAG:
    return {
      ...state,
      isFetching: true,
    };
  case types.REMOVE_TAG_SUCCESS:
    return {
      ...state,
      isFetching: false,
      error: {},
    };
  case types.REMOVE_TAG_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  default:
    return state;
  }
};

export default reducer;
