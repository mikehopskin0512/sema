import * as types from './types';
import { getRepositories } from './api';

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

export const somethingElse = '';
