import { getUsers, updateUserInvitations, updateUserStatus, getAnalytic } from './api';
import * as types from './types';

const requestUpdateUserAvailableInvitations = () => ({
  type: types.REQUEST_UPDATE_USER_AVAILABLE_INVITATIONS,
});

const requestUpdateUserAvailableInvitationsSuccess = (user) => ({
  type: types.REQUEST_UPDATE_USER_AVAILABLE_INVITATIONS_SUCCESS,
  user,
});

const requestUpdateUserAvailableInvitationsError = (errors) => ({
  type: types.REQUEST_UPDATE_USER_AVAILABLE_INVITATIONS_ERROR,
  errors,
});

const requestFetchUsers = () => ({
  type: types.REQUEST_FETCH_USERS,
});

const requestFetchUsersSuccess = (users) => ({
  type: types.REQUEST_FETCH_USERS_SUCCESS,
  users,
});

const requestFetchUsersError = (errors) => ({
  type: types.REQUEST_FETCH_USERS_ERROR,
  errors,
});

const requestUpdateUserStatus = () => ({
  type: types.UPDATE_USER_STATUS,
});

const requestUpdateUserStatusSuccess = (users) => ({
  type: types.UPDATE_USER_STATUS_SUCCESS,
  users,
});

const requestUpdateUserStatusError = (errors) => ({
  type: types.UPDATE_USER_STATUS_ERROR,
  errors,
});

const requestFetchAnalyticData = () => ({
  type: types.REQUEST_FETCH_ANALYTIC_DATA,
});

const requestFetchAnalyticDataSuccess = (data) => ({
  type: types.REQUEST_FETCH_ANALYTIC_DATA_SUCCESS,
  data,
});

const requestFetchAnalyticDataError = (errors) => ({
  type: types.REQUEST_FETCH_ANALYTIC_DATA_ERROR,
  errors,
});

export const fetchUsers = (params = {}, token) => async (dispatch) => {
  try {
    dispatch(requestFetchUsers());
    const payload = await getUsers(params, token);
    const { data: { users = [] } } = payload;

    dispatch(requestFetchUsersSuccess(users));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestFetchUsersError(errMessage));
  }
};

export const updateUserAvailableInvitationsCount = (userId, amount, search) => async (dispatch) => {
  try {
    dispatch(requestUpdateUserAvailableInvitations());
    await updateUserInvitations(userId, { amount });

    dispatch(requestUpdateUserAvailableInvitationsSuccess());
    return Promise.resolve();
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestUpdateUserAvailableInvitationsError(errMessage));
    return Promise.reject();
  }
};

export const updateStatus = (params = {}, token) => async (dispatch) => {
  try {
    dispatch(requestUpdateUserStatus());
    const payload = await updateUserStatus(params, token);
    const { data: { users = [] } } = payload;

    dispatch(requestUpdateUserStatusSuccess(users));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestUpdateUserStatusError(errMessage));
  }
};

export const getAnalyticData = (params = {}, token) => async (dispatch) => {
  try {
    dispatch(requestFetchAnalyticData());
    const payload = await getAnalytic(params, token);
    const { data } = payload;

    dispatch(requestFetchAnalyticDataSuccess(data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestFetchAnalyticDataError(errMessage));
  }
};
