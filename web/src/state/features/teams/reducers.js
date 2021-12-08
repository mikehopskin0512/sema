import * as types from './types';

const initialState = {
  teams: [],
  isFetching: false,
  members: [],
  membersCount: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.FETCH_TEAMS:
    return {
      ...state,
      isFetching: true,
    };
  case types.FETCH_TEAMS_SUCCESS:
    return {
      ...state,
      isFetching: true,
      teams: action.teams,
    };
  case types.FETCH_TEAMS_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.CREATE_NEW_TEAM:
    return {
      ...state,
      isFetching: true,
    };
  case types.CREATE_NEW_TEAM_SUCCESS:
    return {
      ...state,
      isFetching: false,
      error: {},
    };
  case types.CREATE_NEW_TEAM_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.FETCH_TEAM_MEMBERS:
    return {
      ...state,
      isFetching: true,
    };
  case types.FETCH_TEAM_MEMBERS_SUCCESS:
    return {
      ...state,
      members: action.data ? action.data.members : [],
      membersCount: action.data ? action.data.totalCount : 0,
      isFetching: false,
      error: {},
    };
  case types.FETCH_TEAM_MEMBERS_ERROR:
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
