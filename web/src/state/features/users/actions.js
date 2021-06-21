import { getUser, getUsers, updateUserInvitations, updateUserStatus } from './api';
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

const requestFetchUsersSuccess = (users, filters) => ({
  type: types.REQUEST_FETCH_USERS_SUCCESS,
  users,
  filters
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

const requestFetchUser = () => ({
  type: types.REQUEST_FETCH_USER,
});

const requestFetchUserSuccess = (user) => ({
  type: types.REQUEST_FETCH_USER_SUCCESS,
  user,
});

const requestFetchUserError = (errors) => ({
  type: types.REQUEST_FETCH_USER_ERROR,
  errors,
});

export const fetchUsers = (params = {}, token) => async (dispatch) => {
  try {
    dispatch(requestFetchUsers());
    const payload = await getUsers(params, token);
    const { data: { users = [], filters = [] } } = payload;

    dispatch(requestFetchUsersSuccess(users, filters));
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

export const fetchUser = (id, token) => async (dispatch) => {
  try {
    dispatch(requestFetchUser());
    const payload = await getUser(id, token);
    const { data } = payload;

    dispatch(requestFetchUserSuccess(data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestFetchUserError(errMessage));
  }
};