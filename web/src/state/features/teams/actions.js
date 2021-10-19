import {
  addTeam,
  fetchTeams,
} from './api';
import * as types from './types';

const getTeamsRequest = () => ({
  type: types.GET_TEAMS,
});

const getTeamsSuccess = (teams) => ({
  type: types.GET_TEAMS_SUCCESS,
  teams,
});

const getTeamsError = (errors) => ({
  type: types.GET_TEAMS_ERROR,
  errors,
});

const createTeamRequest = () => ({
  type: types.CREATE_NEW_TEAM,
});

const createTeamSuccess = () => ({
  type: types.CREATE_NEW_TEAM_SUCCESS,
});

const createTeamError = (errors) => ({
  type: types.CREATE_NEW_TEAM_ERROR,
  errors,
});

export const getTeams = (token) => async (dispatch) => {
  try {
    dispatch(getTeamsRequest());
    const payload = await fetchTeams(token);
    const { data } = payload;
    dispatch(getTeamsSuccess(data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(getTeamsError(errMessage));
  }
};

export const createTeam = (body, token) => async (dispatch) => {
  try {
    dispatch(createTeamRequest());
    const payload = await addTeam(body, token);
    const { data } = payload;
    dispatch(createTeamSuccess(data));
    return data;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(createTeamError(errMessage));
  }
};
