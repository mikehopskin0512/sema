import Router from 'next/router';
import * as types from './types';
import { 
  getRepos, postRepositories, postAnalysis, getRepo, filterSemaRepos
} from './api';
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

const requestCreateAnalysis = () => ({
  type: types.REQUEST_CREATE_ANALYSIS,
});

const requestCreateAnalysisSuccess = (source) => ({
  type: types.REQUEST_CREATE_ANALYSIS_SUCCESS,
  source,
});

const requestCreateAnalysisError = (errors) => ({
  type: types.REQUEST_CREATE_ANALYSIS_ERROR,
  errors,
});

const requestFetchRepo = () => ({
  type: types.REQUEST_FETCH_REPO,
});

const requestFetchRepoSuccess = (repository) => ({
  type: types.REQUEST_FETCH_REPO_SUCCESS,
  repository,
});

const requestFetchRepoError = (errors) => ({
  type: types.REQUEST_FETCH_REPO_ERROR,
  errors,
});

const requestFilterSemaRepos = () => ({
  type: types.REQUEST_FILTER_SEMA_REPOS,
});

const requestFilterSemaReposSuccess = (repositories) => ({
  type: types.REQUEST_FILTER_SEMA_REPOS_SUCCESS,
  repositories,
});

const requestFilterSemaReposError = (errors) => ({
  type: types.REQUEST_FILTER_SEMA_REPOS_ERROR,
  errors,
});

export const requestGetUserRepos = () => ({
  type: types.REQUEST_GET_USER_REPOS,
});

export const requestGetUserReposSuccess = (repositories) => ({
  type: types.REQUEST_GET_USER_REPOS_SUCCESS,
  repositories,
});

export const requestGetUserReposError = (errors) => ({
  type: types.REQUEST_GET_USER_REPOS_ERROR,
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

export const addAnalysis = (repository, token) => async (dispatch) => {
  const { _id: repositoryId, name, legacyId, sourceId: { externalSourceId } } = repository;
  try {
    dispatch(requestCreateAnalysis());
    const payload = await postAnalysis({ repositoryId, legacyId, externalSourceId }, token);
    const { data: { repositories = [] } } = payload;

    dispatch(triggerAlert(`Analysis started for ${name}`, 'success'));

    dispatch(requestCreateAnalysisSuccess(repositories));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestCreateAnalysisError(errMessage));
    dispatch(triggerAlert(errMessage, 'error'));
  }
};

export const fetchRepo = (repositoryId, token) => async (dispatch) => {
  try {
    dispatch(requestFetchRepo());
    const payload = await getRepo(repositoryId, token);
    const { data: { repository = [] } } = payload;

    dispatch(requestFetchRepoSuccess(repository));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestFetchRepoError(errMessage));
    dispatch(triggerAlert(errMessage, 'error'));
  }
};

export const filterSemaRepositories = (externalId, token) => async (dispatch) => {
  try {
    console.log(externalId);
    dispatch(requestFilterSemaRepos());
    const payload = await filterSemaRepos({ externalId }, token);
    const { data: { repositories = [] } } = payload;
    dispatch(requestFilterSemaReposSuccess(repositories));
    return repositories;
  } catch (error) {
    console.log(error);
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestFilterSemaReposError(errMessage));
  }
};
