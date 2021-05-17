import { getUsers, updateUserInvitations } from './api';
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
