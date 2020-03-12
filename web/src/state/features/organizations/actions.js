import * as types from './types';
import { getFileTypes, getUsers, getRepositories } from './api';

const requestFileTypes = () => ({
  type: types.REQUEST_FILETYPES,
});

const receiveFileTypes = (data) => ({
  type: types.RECEIVE_FILETYPES,
  fileTypes: data,
});

const requestFileTypesError = (errors) => ({
  type: types.REQUEST_FILETYPES_ERROR,
  errors,
});

const requestRepositories = () => ({
  type: types.REQUEST_REPOSITORIES,
});

const receiveRepositories = (data) => ({
  type: types.RECEIVE_REPOSITORIES,
  repositories: data,
});

const requestRepositoriesError = (errors) => ({
  type: types.REQUEST_REPOSITORIES_ERROR,
  errors,
});

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

export const fetchFileTypes = (orgId, token) => async (dispatch) => {
  dispatch(requestFileTypes());
  const fileTypes = await getFileTypes(orgId, token);

  if (fileTypes.error) {
    dispatch(requestFileTypesError(fileTypes.error));
  }

  if (fileTypes.data) {
    dispatch(receiveFileTypes(fileTypes.data));
  }
};

export const fetchRepositories = (orgId, token) => async (dispatch) => {
  dispatch(requestRepositories());
  const repositories = await getRepositories(orgId, token);

  if (repositories.error) {
    dispatch(requestRepositoriesError(repositories.error));
  }

  if (repositories.data) {
    dispatch(receiveRepositories(repositories.data));
  }
};

export const fetchUsers = (orgId, token) => async (dispatch) => {
  dispatch(requestUsers());
  const users = await getUsers(orgId, token);

  if (users.error) {
    dispatch(requestUsersError(users.error));
  }

  if (users.data) {
    dispatch(receiveUsers(users.data));
  }
};
