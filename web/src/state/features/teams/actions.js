import {
  addTeam,
  getTeamMembers,
  getTeamMetrics,
  getTeamRepos,
  getTeams,
  postInviteUsersToTeam,
  updateTeam,
  updateTeamRepos,
  postTeamInvitationEmailValidation,
  getAllTeamCollections,
  inviteToTeam,
  uploadAvatar,
} from './api';
import { toggleActiveCollection, getSmartCommentOverview, getSmartCommentSummary } from '../comments/api';
import * as types from './types';
import { setSelectedTeam } from '../auth/actions';

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

const requestTeamInvitationEmailValidationRequest = () => ({
  type: types.REQUEST_INVITATION_EMAIL_VALIDATION,
});

const requestTeamInvitationEmailValidationSuccess = (invalidEmails) => ({
  type: types.REQUEST_INVITATION_EMAIL_VALIDATION_SUCCESS,
  invalidEmails,
});

const requestTeamInvitationEmailValidationError = () => ({
  type: types.REQUEST_INVITATION_EMAIL_VALIDATION_ERROR,
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

const requestToggleTeamCollection = () => ({
  type: types.REQUEST_TOGGLE_ACTIVE_COLLECTION
});

const requestToggleTeamCollectionSuccess = () => ({
  type: types.REQUEST_TOGGLE_ACTIVE_COLLECTION_SUCCESS
});

const requestToggleTeamCollectionError = (errors) => ({
  type: types.REQUEST_TOGGLE_ACTIVE_COLLECTION_ERROR,
  errors,
});

const requestFetchTeamCollectionsRequest = () => ({
  type: types.FETCH_TEAM_COLLECTIONS,
});

const requestFetchTeamCollectionsSuccess = (collections) => ({
  type: types.FETCH_TEAM_COLLECTIONS_SUCCESS,
  collections,
});

const requestFetchTeamCollectionsError = (errors) => ({
  type: types.FETCH_TEAM_COLLECTIONS_ERROR,
  errors,
});

const requestFetchTeamSmartCommentSummary = () => ({
  type: types.REQUEST_FETCH_TEAM_SMART_COMMENT_SUMMARY
});

const requestFetchTeamSmartCommentSummarySuccess = (summary) => ({
  type: types.REQUEST_FETCH_TEAM_SMART_COMMENT_SUMMARY_SUCCESS,
  summary
});

const requestFetchTeamSmartCommentSummaryError = () => ({
  type: types.REQUEST_FETCH_TEAM_SMART_COMMENT_SUMMARY_ERROR
});

const requestFetchTeamSmartCommentOverview = () => ({
  type: types.REQUEST_FETCH_TEAM_SMART_COMMENT_OVERVIEW
});

const requestFetchTeamSmartCommentOverviewSuccess = (overview) => ({
  type: types.REQUEST_FETCH_TEAM_SMART_COMMENT_OVERVIEW_SUCCESS,
  overview
});

const requestFetchTeamSmartCommentOverviewError = () => ({
  type: types.REQUEST_FETCH_TEAM_SMART_COMMENT_OVERVIEW_ERROR
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

export const editTeamRepos = (teamId, repos, token) => async (dispatch) => {
  try {
    await updateTeamRepos(teamId, repos, token);
    return repos;
  } catch (e) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchTeamReposError(errMessage));
  }
}

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

export const validateTeamInvitationEmails = (teamId, body, token) => async (dispatch) => {
  try {
    dispatch(requestTeamInvitationEmailValidationRequest());
    const payload = await postTeamInvitationEmailValidation(teamId, body, token);
    const { data } = payload;
    dispatch(requestTeamInvitationEmailValidationSuccess(data?.invalidEmails));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestTeamInvitationEmailValidationError(errMessage));
  }
};

export const setActiveTeamCollections = (id, teamId, token) => async (dispatch) => {
  try {
    dispatch(requestToggleTeamCollection());
    await toggleActiveCollection(id, { teamId }, token);
    dispatch(requestToggleTeamCollectionSuccess());
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestToggleTeamCollectionError(errMessage));
  }
}

export const fetchTeamCollections = (teamId, token) => async (dispatch) => {
  try {
    dispatch(requestFetchTeamCollectionsRequest());
    const collections = await getAllTeamCollections(teamId, token);
    if (collections?.status === 200) {
      dispatch(requestFetchTeamCollectionsSuccess(collections.data));
    }
    return false;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchTeamCollectionsError(errMessage));
  }
}

export const fetchTeamSmartCommentSummary = (params, token) => async (dispatch) => {
  try {
    dispatch(requestFetchTeamSmartCommentSummary())
    const { data } = await getSmartCommentSummary(params, token);
    dispatch(requestFetchTeamSmartCommentSummarySuccess(data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchTeamSmartCommentSummaryError(errMessage));
  }
};

export const fetchTeamSmartCommentOverview = (params, token) => async (dispatch) => {
  try {
    dispatch(requestFetchTeamSmartCommentOverview())
    const { data: { overview } } = await getSmartCommentOverview(params, token);
    dispatch(requestFetchTeamSmartCommentOverviewSuccess(overview));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchTeamSmartCommentOverviewError(errMessage));
  }
};

/* Invite a single member */
export const inviteTeamUser = (teamId, token) => async (dispatch) => {
  try {
    dispatch(inviteTeamUsersRequest());
    await inviteToTeam(teamId, token);
    dispatch(inviteTeamUsersSuccess());
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(inviteTeamUsersError(errMessage));
  }
};

export const uploadTeamAvatar = (teamId, body, token) => async (dispatch) => {
  try {
    const res = await uploadAvatar(teamId, body, token);

    dispatch(setSelectedTeam(res.data));
    dispatch(fetchTeamsOfUser(token));
  } catch (error) {
    console.error(error);
  }
};

