import * as types from './types';
import { getUsers } from './api';

const requestUsers = () => ({
  type: types.REQUEST_USERS,
});

const receiveUsers = (data) => ({
  type: types.RECEIVE_USERS,
  users: data,
});

const requestUsersError = (errors) => ({
  type: types.REQUEST_USERS_ERROR,
  errors,
});

export const fetchUsers = (orgId, token) => async (dispatch) => {
  dispatch(requestUsers());
  const users = await getUsers({ orgId }, token);

  if (users.error) {
    dispatch(requestUsersError(users.error));
  }

  if (users.data) {
    dispatch(receiveUsers(users.data));
  }
};

export const somethingElse = '';
