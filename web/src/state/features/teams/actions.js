import {
  addTeam,
  getTeams,
  getTeamMembers,
  postInviteUsersToTeam,
} from './api';
import * as types from './types';

const fetchTeamsRequest = () => ({
  type: types.FETCH_TEAMS,
});

const fetchTeamsSuccess = (teams) => ({
  type: types.FETCH_TEAMS_SUCCESS,
  teams,
});

const fetchTeamsError = (errors) => ({
  type: types.FETCH_TEAMS_ERROR,
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

const fetchTeamMembersRequest = () => ({
  type: types.FETCH_TEAM_MEMBERS,
});

const fetchTeamMembersSuccess = (data) => ({
  type: types.FETCH_TEAM_MEMBERS_SUCCESS,
  data,
});

const fetchTeamMembersError = () => ({
  type: types.FETCH_TEAM_MEMBERS_ERROR,
});

const inviteTeamUsersRequest = () => ({
  type: types.INVITE_TEAM_USERS,
});

const inviteTeamUsersSuccess = () => ({
  type: types.INVITE_TEAM_USERS_SUCCESS,
});

const inviteTeamUsersError = () => ({
  type: types.INVITE_TEAM_USERS_ERROR,
});

export const fetchTeams = (token) => async (dispatch) => {
  try {
    dispatch(fetchTeamsRequest());
    const payload = await getTeams(token);
    const { data } = payload;
    dispatch(fetchTeamsSuccess(data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(fetchTeamsError(errMessage));
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

export const fetchTeamMembers = (id, params, token) => async (dispatch) => {
  try {
    dispatch(fetchTeamMembersRequest());
    const { data } = await getTeamMembers(id, params, token);
    dispatch(fetchTeamMembersSuccess(data));
    return data;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(fetchTeamMembersError(errMessage));
  }
};

export const inviteTeamUsers = (teamId, body, token) => async (dispatch) => {
  try {
    dispatch(inviteTeamUsersRequest());
    await postInviteUsersToTeam(teamId, body, token);
    dispatch(inviteTeamUsersSuccess());
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(inviteTeamUsersError(errMessage));
  }
};