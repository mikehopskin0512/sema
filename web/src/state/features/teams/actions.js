import {
  addOrganization,
  getOrganizationMembers,
  getOrganizationMetrics,
  getOrganizationRepos,
  getOrganizations,
  postInviteUsersToOrganization,
  updateOrganization,
  updateOrganizationRepos,
  postOrganizationInvitationEmailValidation,
  getAllOrganizationCollections,
  inviteToOrganization,
  uploadAvatar,
} from './api';
import { toggleActiveCollection, getSmartCommentOverview, getSmartCommentSummary } from '../comments/api';
import * as types from './types';
import { setSelectedOrganization } from '../auth/actions';

const requestFetchOrganizationsOfUser = () => ({
  type: types.REQUEST_FETCH_ORGANIZATIONS_OF_USER,
});

const requestFetchOrganizationsOfUserSuccess = (teams) => ({
  type: types.REQUEST_FETCH_ORGANIZATIONS_OF_USER_SUCCESS,
  teams,
});

const requestFetchOrganizationsOfUserError = (errors) => ({
  type: types.REQUEST_FETCH_ORGANIZATIONS_OF_USER_ERROR,
  errors,
});

const createOrganizationRequest = () => ({
  type: types.CREATE_NEW_ORGANIZATION,
});

const createOrganizationSuccess = () => ({
  type: types.CREATE_NEW_ORGANIZATION_SUCCESS,
});

const createOrganizationError = (errors) => ({
  type: types.CREATE_NEW_ORGANIZATION_ERROR,
  errors,
});

const requestFetchOrganizationMembers = () => ({
  type: types.REQUEST_FETCH_ORGANIZATION_MEMBERS
});

const requestFetchOrganizationMembersSuccess = (members, membersCount) => ({
  type: types.REQUEST_FETCH_ORGANIZATION_MEMBERS_SUCCESS,
  members,
  membersCount,
});

const requestFetchOrganizationMembersError = () => ({
  type: types.REQUEST_FETCH_ORGANIZATION_MEMBERS_ERROR
});

const requestFetchOrganizationMetrics = () => ({
  type: types.REQUEST_FETCH_ORGANIZATION_METRICS
});

const requestFetchOrganizationMetricsSuccess = (metrics) => ({
  type: types.REQUEST_FETCH_ORGANIZATION_METRICS_SUCCESS,
  metrics
});

const requestFetchOrganizationMetricsError = () => ({
  type: types.REQUEST_FETCH_ORGANIZATION_METRICS_ERROR
});

const requestFetchOrganizationRepos = () => ({
  type: types.REQUEST_FETCH_ORGANIZATION_REPOS
});

const requestFetchOrganizationReposSuccess = (repos) => ({
  type: types.REQUEST_FETCH_ORGANIZATION_REPOS_SUCCESS,
  repos
});

const requestFetchOrganizationReposError = () => ({
  type: types.REQUEST_FETCH_ORGANIZATION_REPOS_ERROR
});

const inviteOrganizationUsersRequest = () => ({
  type: types.INVITE_ORGANIZATION_USERS,
});

const inviteOrganizationUsersSuccess = () => ({
  type: types.INVITE_ORGANIZATION_USERS_SUCCESS,
});

const inviteOrganizationUsersError = () => ({
  type: types.INVITE_ORGANIZATION_USERS_ERROR,
});

const requestOrganizationInvitationEmailValidationRequest = () => ({
  type: types.REQUEST_INVITATION_EMAIL_VALIDATION,
});

const requestOrganizationInvitationEmailValidationSuccess = (invalidEmails) => ({
  type: types.REQUEST_INVITATION_EMAIL_VALIDATION_SUCCESS,
  invalidEmails,
});

const requestOrganizationInvitationEmailValidationError = () => ({
  type: types.REQUEST_INVITATION_EMAIL_VALIDATION_ERROR,
});

const requestEditOrganization = () => ({
  type: types.REQUEST_EDIT_ORGANIZATION
});

const requestEditOrganizationSuccess = () => ({
  type: types.REQUEST_EDIT_ORGANIZATION_SUCCESS
});

const requestEditOrganizationError = (errors) => ({
  type: types.REQUEST_EDIT_ORGANIZATION_ERROR,
  errors,
});

const requestToggleOrganizationCollection = () => ({
  type: types.REQUEST_TOGGLE_ACTIVE_COLLECTION
});

const requestToggleOrganizationCollectionSuccess = () => ({
  type: types.REQUEST_TOGGLE_ACTIVE_COLLECTION_SUCCESS
});

const requestToggleOrganizationCollectionError = (errors) => ({
  type: types.REQUEST_TOGGLE_ACTIVE_COLLECTION_ERROR,
  errors,
});

const requestFetchOrganizationCollectionsRequest = () => ({
  type: types.FETCH_ORGANIZATION_COLLECTIONS,
});

const requestFetchOrganizationCollectionsSuccess = (collections) => ({
  type: types.FETCH_ORGANIZATION_COLLECTIONS_SUCCESS,
  collections,
});

const requestFetchOrganizationCollectionsError = (errors) => ({
  type: types.FETCH_ORGANIZATION_COLLECTIONS_ERROR,
  errors,
});

const requestFetchOrganizationSmartCommentSummary = () => ({
  type: types.REQUEST_FETCH_ORGANIZATION_SMART_COMMENT_SUMMARY
});

const requestFetchOrganizationSmartCommentSummarySuccess = (summary) => ({
  type: types.REQUEST_FETCH_ORGANIZATION_SMART_COMMENT_SUMMARY_SUCCESS,
  summary
});

const requestFetchOrganizationSmartCommentSummaryError = () => ({
  type: types.REQUEST_FETCH_ORGANIZATION_SMART_COMMENT_SUMMARY_ERROR
});

const requestFetchOrganizationSmartCommentOverview = () => ({
  type: types.REQUEST_FETCH_ORGANIZATION_SMART_COMMENT_OVERVIEW
});

const requestFetchOrganizationSmartCommentOverviewSuccess = (overview) => ({
  type: types.REQUEST_FETCH_ORGANIZATION_SMART_COMMENT_OVERVIEW_SUCCESS,
  overview
});

const requestFetchOrganizationSmartCommentOverviewError = () => ({
  type: types.REQUEST_FETCH_ORGANIZATION_SMART_COMMENT_OVERVIEW_ERROR
});

export const fetchOrganizationsOfUser = (token) => async (dispatch) => {
  try {
    dispatch(requestFetchOrganizationsOfUser());
    const payload = await getOrganizations(token);
    const { data } = payload;
    dispatch(requestFetchOrganizationsOfUserSuccess(data));
    return data
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchOrganizationsOfUserError(errMessage));
  }
};

export const createOrganization = (body, token) => async (dispatch) => {
  try {
    dispatch(createOrganizationRequest());
    const payload = await addOrganization(body, token);
    const { data } = payload;
    dispatch(createOrganizationSuccess(data));
    return data;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(createOrganizationError(errMessage));
  }
};

export const editOrganization = (body, token) => async (dispatch) => {
  try {
    dispatch(requestEditOrganization());
    const payload = await updateOrganization(body, token);
    const { data } = payload;
    dispatch(requestEditOrganizationSuccess(data));
    return data;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestEditOrganizationError(errMessage));
  }
};

export const fetchOrganizationMembers = (id, params, token) => async (dispatch) => {
  try {
    dispatch(requestFetchOrganizationMembers());
    const { data } = await getOrganizationMembers(id, params, token);
    dispatch(requestFetchOrganizationMembersSuccess(data?.members, data?.totalCount));
    return data;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchOrganizationMembersError(errMessage));
  }
};

export const editOrganizationRepos = (teamId, repos, token) => async (dispatch) => {
  try {
    await updateOrganizationRepos(teamId, repos, token);
    return repos;
  } catch (e) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchOrganizationReposError(errMessage));
  }
}

export const fetchOrganizationMetrics = (teamId, token) => async (dispatch) => {
  try {
    dispatch(requestFetchOrganizationMetrics());
    const payload = await getOrganizationMetrics(teamId, token);
    const { data } = payload;
    dispatch(requestFetchOrganizationMetricsSuccess(data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchOrganizationMetricsError(errMessage));
  }
}

export const fetchOrganizationRepos = ({ teamId, searchParams = '' }, token) => async (dispatch) => {
  try {
    dispatch(requestFetchOrganizationRepos());
    const payload = await getOrganizationRepos(teamId, { searchParams }, token);
    const { data } = payload;
    dispatch(requestFetchOrganizationReposSuccess(data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchOrganizationReposError(errMessage));
  }
}

export const inviteOrganizationUsers = (teamId, body, token) => async (dispatch) => {
  try {
    dispatch(inviteOrganizationUsersRequest());
    await postInviteUsersToOrganization(teamId, body, token);
    dispatch(inviteOrganizationUsersSuccess());
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(inviteOrganizationUsersError(errMessage));
  }
};

export const validateOrganizationInvitationEmails = (teamId, body, token) => async (dispatch) => {
  try {
    dispatch(requestOrganizationInvitationEmailValidationRequest());
    const payload = await postOrganizationInvitationEmailValidation(teamId, body, token);
    const { data } = payload;
    dispatch(requestOrganizationInvitationEmailValidationSuccess(data?.invalidEmails));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestOrganizationInvitationEmailValidationError(errMessage));
  }
};

export const setActiveOrganizationCollections = (id, teamId, token) => async (dispatch) => {
  try {
    dispatch(requestToggleOrganizationCollection());
    await toggleActiveCollection(id, { teamId }, token);
    dispatch(requestToggleOrganizationCollectionSuccess());
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestToggleOrganizationCollectionError(errMessage));
  }
}

export const fetchOrganizationCollections = (teamId, token) => async (dispatch) => {
  try {
    dispatch(requestFetchOrganizationCollectionsRequest());
    const collections = await getAllOrganizationCollections(teamId, token);
    if (collections?.status === 200) {
      dispatch(requestFetchOrganizationCollectionsSuccess(collections.data));
    }
    return false;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchOrganizationCollectionsError(errMessage));
  }
}

export const fetchOrganizationSmartCommentSummary = (params, token) => async (dispatch) => {
  try {
    dispatch(requestFetchOrganizationSmartCommentSummary())
    const { data } = await getSmartCommentSummary(params, token);
    dispatch(requestFetchOrganizationSmartCommentSummarySuccess(data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchOrganizationSmartCommentSummaryError(errMessage));
  }
};

export const fetchOrganizationSmartCommentOverview = (params, token) => async (dispatch) => {
  try {
    dispatch(requestFetchOrganizationSmartCommentOverview())
    const { data: { overview } } = await getSmartCommentOverview(params, token);
    dispatch(requestFetchOrganizationSmartCommentOverviewSuccess(overview));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchOrganizationSmartCommentOverviewError(errMessage));
  }
};

/* Invite a single member */
export const inviteOrganizationUser = (teamId, token) => async (dispatch) => {
  try {
    dispatch(inviteOrganizationUsersRequest());
    await inviteToOrganization(teamId, token);
    dispatch(inviteOrganizationUsersSuccess());
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(inviteOrganizationUsersError(errMessage));
  }
};

export const uploadOrganizationAvatar = (teamId, body, token) => async (dispatch) => {
  try {
    const res = await uploadAvatar(teamId, body, token);

    dispatch(setSelectedOrganization(res.data));
    dispatch(fetchOrganizationsOfUser(token));
  } catch (error) {
    console.error(error);
  }
};

