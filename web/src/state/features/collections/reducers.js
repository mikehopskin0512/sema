import * as types from './types';

const initialState = {
  isFetching: false,
  data: [],
  collection: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_CREATE_COLLECTIONS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_CREATE_COLLECTIONS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: action.collections,
      error: {},
    };
  case types.REQUEST_CREATE_COLLECTIONS_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_FIND_COLLECTIONS_BY_AUTHOR:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FIND_COLLECTIONS_BY_AUTHOR_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: action.collections,
      error: {},
    };
  case types.REQUEST_FIND_COLLECTIONS_BY_AUTHOR_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_FETCH_ALL_USER_COLLECTIONS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_ALL_USER_COLLECTIONS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: action.collections,
      error: {},
    };
  case types.REQUEST_FETCH_ALL_USER_COLLECTIONS_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.FETCH_COLLECTION:
    return {
      ...state,
      isFetching: true,
    };
  case types.FETCH_COLLECTION_SUCCESS:
    return {
      ...state,
      isFetching: false,
      collection: action.collection,
      error: {},
    };
  case types.FETCH_COLLECTION_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_UPDATE_COLLECTION:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_UPDATE_COLLECTION_SUCCESS:
    return {
      ...state,
      isFetching: false,
      collection: action.collection,
      error: {},
    };
  case types.REQUEST_UPDATE_COLLECTION_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.OPTIMISTIC_TOGGLE_USER_COLLECTION_ACTIVE:
    const newData = [...state.data];
    const collection = newData.find(collection => collection.collectionData._id === action.id);
    collection.isActive = !collection.isActive;
    return {
      ...state,
      data: newData,
    };
  default:
    return state;
  }
};

export default reducer;
