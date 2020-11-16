import Router from 'next/router';
import * as types from './types';
import { getRepos, postRepositories } from './api';
import { alertOperations } from '../alerts';

const { triggerAlert, clearAlert } = alertOperations;

const requestCreateRepo = () => ({
  type: types.REQUEST_CREATE_REPO,
});

const requestCreateRepoSuccess = (source) => ({
  type: types.REQUEST_CREATE_REPO_SUCCESS,
  source,
});

const requestCreateRepoError = (errors) => ({
  type: types.REQUEST_CREATE_REPO_ERROR,
  errors,
});

const requestFetchRepos = () => ({
  type: types.REQUEST_FETCH_REPOS,
});

const requestFetchReposSuccess = (repositories) => ({
  type: types.REQUEST_FETCH_REPOS_SUCCESS,
  repositories,
});

const requestFetchReposError = (errors) => ({
  type: types.REQUEST_FETCH_REPOS_ERROR,
  errors,
});

export const addRepositories = (repositoriesData, token) => async (dispatch) => {
  try {
    dispatch(requestCreateRepo());
    const payload = await postRepositories({ repositories: repositoriesData }, token);
    const { data: { repositories = [] } } = payload;

    Router.push('/repositories');
    dispatch(triggerAlert('Repositories have been added', 'success'));

    dispatch(requestCreateRepoSuccess(repositories));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestCreateRepoError(errMessage));
  }
};

export const fetchRepos = (orgId, token) => async (dispatch) => {
  try {
    dispatch(requestFetchRepos());
    const payload = await getRepos({ orgId }, token);
    const { data: { repositories = [] } } = payload;

    dispatch(requestFetchReposSuccess(repositories));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestFetchReposError(errMessage));
  }
};
