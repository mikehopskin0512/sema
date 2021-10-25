import * as types from './types';

const initialState = {
  teams: [],
  isFetching: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.GET_TEAMS:
    return {
      ...state,
      isFetching: true,
    };
  case types.GET_TEAMS_SUCCESS:
    return {
      ...state,
      isFetching: true,
      teams: action.teams,
    };
  case types.GET_TEAMS_ERROR:
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
  default:
    return state;
  }
};

export default reducer;
