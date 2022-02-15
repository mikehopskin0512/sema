import * as types from './types';

const initialState = {
  isFetching: false,
  data: {
    snapshots: [],
    snapshot: {},
  },
  error: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_FETCH_USER_SNAPSHOTS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_USER_SNAPSHOTS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        snapshots: action.snapshots,
      },
    };
  case types.REQUEST_FETCH_USER_SNAPSHOTS_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_UPDATE_SNAPSHOT:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_UPDATE_SNAPSHOT_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        snapshot: action.snapshot,
      },
    };
  case types.REQUEST_UPDATE_SNAPSHOT_ERROR:
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
