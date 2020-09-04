import * as types from './types';
import { getFileTypes, getContributors, getRepositories } from './api';

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

const requestContributors = () => ({
  type: types.REQUEST_CONTRIBUTORS,
});

const receiveContributors = (data) => ({
  type: types.RECEIVE_CONTRIBUTORS,
  users: data,
});

const requestContributorsError = (errors) => ({
  type: types.REQUEST_CONTRIBUTORS_ERROR,
  errors,
});

const receiveFilters = (params) => ({
  type: types.RECEIVE_FILTERS,
  params,
});

const resetFilters = () => ({
  type: types.RESET_FILTERS,
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

export const fetchContributors = (orgId, token) => async (dispatch) => {
  dispatch(requestContributors());
  const users = await getContributors(orgId, token);

  if (users.error) {
    dispatch(requestContributorsError(users.error));
  }

  if (users.data) {
    dispatch(receiveContributors(users.data));
  }
};

export const updateFilters = (params) => async (dispatch) => {
  dispatch(receiveFilters(params));
};

export const clearFilters = () => async (dispatch) => {
  dispatch(resetFilters());
};