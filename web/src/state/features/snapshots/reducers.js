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
          snapshots: state.data.snapshots.map(someSnapshot => {
            if (someSnapshot._id === action.snapshot._id) return action.snapshot;
            return someSnapshot;
          }),
          snapshot: action.snapshot,
        },
      };
    case types.REQUEST_UPDATE_SNAPSHOT_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.errors,
      };
    case types.REQUEST_DELETE_SNAPSHOT:
      return {
        ...state,
        isFetching: true,
      };
    case types.REQUEST_DELETE_SNAPSHOT_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.errors,
      };
    case types.REQUEST_DELETE_SNAPSHOT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: {
          ...state.data,
          snapshots: state.data.snapshots.filter(
            (item) => item._id !== action.id
          ),
        },
        error: {},
      };
    case types.REQUEST_ADD_SNAPSHOT_TO_PORTFOLIO:
      const { portfolioId, snapshotId } = action;
      return {
        ...state,
        data: {
          ...state.data,
          snapshots: state.data.snapshots.map(
            (item) => item._id === snapshotId ? {
              ...item,
              portfolios: item.portfolios.includes(portfolioId) ? item.portfolios : [...item.portfolios, portfolioId],
            } : item,
          ),
        }
      }
    case types.REQUEST_CREATE_SNAPSHOT:
      return {
        ...state,
        isFetching: true,
      };
    case types.REQUEST_CREATE_SNAPSHOT_SUCCESS:
      console.log(action.snapshot, [...state.data.snapshots])
      return {
        ...state,
        isFetching: false,
        data: {
          snapshots: [...state.data.snapshots, action.snapshot],
          snapshot: action.snapshot,
        },
      };
    case types.REQUEST_CREATE_SNAPSHOT_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    default:
      return state;
  }
};

export default reducer;
