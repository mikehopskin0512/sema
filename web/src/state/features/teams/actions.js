import {
  addTeam,
  getTeamMembers,
  getTeamMetrics,
  getTeamRepos,
  getTeams,
  postInviteUsersToTeam,
  updateTeam,
} from './api';
import * as types from './types';

const requestFetchTeamsOfUser = () => ({
  type: types.REQUEST_FETCH_TEAMS_OF_USER,
});

const requestFetchTeamsOfUserSuccess = (teams) => ({
  type: types.REQUEST_FETCH_TEAMS_OF_USER_SUCCESS,
  teams,
});

const requestFetchTeamsOfUserError = (errors) => ({
  type: types.REQUEST_FETCH_TEAMS_OF_USER_ERROR,
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

const requestFetchTeamMembers = () => ({
  type: types.REQUEST_FETCH_TEAM_MEMBERS
});

const requestFetchTeamMembersSuccess = (members, membersCount) => ({
  type: types.REQUEST_FETCH_TEAM_MEMBERS_SUCCESS,
  members,
  membersCount,
});

const requestFetchTeamMembersError = () => ({
  type: types.REQUEST_FETCH_TEAM_MEMBERS_ERROR
});

const requestFetchTeamMetrics = () => ({
  type: types.REQUEST_FETCH_TEAM_METRICS
});

const requestFetchTeamMetricsSuccess = (metrics) => ({
  type: types.REQUEST_FETCH_TEAM_METRICS_SUCCESS,
  metrics
});

const requestFetchTeamMetricsError = () => ({
  type: types.REQUEST_FETCH_TEAM_METRICS_ERROR
});

const requestFetchTeamRepos = () => ({
  type: types.REQUEST_FETCH_TEAM_REPOS
});

const requestFetchTeamReposSuccess = (repos) => ({
  type: types.REQUEST_FETCH_TEAM_REPOS_SUCCESS,
  repos
});

const requestFetchTeamReposError = () => ({
  type: types.REQUEST_FETCH_TEAM_REPOS_ERROR
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

const requestEditTeam = () => ({
  type: types.REQUEST_EDIT_TEAM
});

const requestEditTeamSuccess = () => ({
  type: types.REQUEST_EDIT_TEAM_SUCCESS
});

const requestEditTeamError = (errors) => ({
  type: types.REQUEST_EDIT_TEAM_ERROR,
  errors,
});

export const fetchTeamsOfUser = (token) => async (dispatch) => {
  try {
    dispatch(requestFetchTeamsOfUser());
    const payload = await getTeams(token);
    const { data } = payload;
    dispatch(requestFetchTeamsOfUserSuccess(data));
    return data
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchTeamsOfUserError(errMessage));
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

export const editTeam = (body, token) => async (dispatch) => {
  try {
    dispatch(requestEditTeam());
    const payload = await updateTeam(body, token);
    const { data } = payload;
    dispatch(requestEditTeamSuccess(data));
    return data;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestEditTeamError(errMessage));
  }
};

export const fetchTeamMembers = (id, params, token) => async (dispatch) => {
  try {
    dispatch(requestFetchTeamMembers());
    const { data } = await getTeamMembers(id, params, token);
    dispatch(requestFetchTeamMembersSuccess(data?.members, data?.totalCount));
    return data;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchTeamMembersError(errMessage));
  }
};


export const fetchTeamMetrics = (teamId, token) => async (dispatch) => {
  try {
    dispatch(requestFetchTeamMetrics());
    const payload = await getTeamMetrics(teamId, token);
    const { data } = payload;
    dispatch(requestFetchTeamMetricsSuccess(data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchTeamMetricsError(errMessage));
  }
}

export const fetchTeamRepos = (teamId, token) => async (dispatch) => {
  try {
    dispatch(requestFetchTeamRepos());
    const payload = await getTeamRepos(teamId, token);
    const { data } = payload;
    dispatch(requestFetchTeamReposSuccess(data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchTeamReposError(errMessage));
  }
}

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
