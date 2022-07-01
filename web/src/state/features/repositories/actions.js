import Router from 'next/router';
import * as types from './types';
import {
  filterSemaRepos, getDashboardRepositories, getRepo, getRepos, getRepositoriesFilters, getRepositoryOverview, postAnalysis, postRepositories, toggleIsPinned,
} from './api';
import { alertOperations } from '../alerts';
import { parseErrorMessage } from '../../../utils/errorHandler';
import { getDateSub } from '../../../utils/parsing';

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

export const requestGetRepoReactions = () => ({
  type: types.REQUEST_GET_REPO_REACTIONS,
});

export const requestGetRepoReactionsSuccess = (reactions) => ({
  type: types.REQUEST_GET_REPO_REACTIONS_SUCCESS,
  reactions,
});

export const requestGetReposReactionsError = (errors) => ({
  type: types.REQUEST_GET_REPO_REACTIONS_ERROR,
  errors,
});

export const requestGetRepoTags = () => ({
  type: types.REQUEST_GET_REPO_TAGS,
});

export const requestGetRepoTagsSuccess = (tags) => ({
  type: types.REQUEST_GET_REPO_TAGS_SUCCESS,
  tags,
});

export const requestGetRepoTagsError = (errors) => ({
  type: types.REQUEST_GET_REPO_TAGS_ERROR,
  errors,
});

const requestFetchRepositoryOverview = () => ({
  type: types.REQUEST_FETCH_REPOSITORY_OVERVIEW,
});

const requestFetchRepositoryOverviewSuccess = (overview) => ({
  type: types.REQUEST_FETCH_REPOSITORY_OVERVIEW_SUCCESS,
  overview,
});

const requestFetchRepositoryOverviewError = (errors) => ({
  type: types.REQUEST_FETCH_REPOSITORY_OVERVIEW_ERROR,
  errors,
});

const requestFetchDashboardRepos = () => ({
  type: types.REQUEST_FETCH_DASHBOARD_REPOSITORIES,
});

const requestFetchDashboardReposSuccess = (repositories) => ({
  type: types.REQUEST_FETCH_DASHBOARD_REPOSITORIES_SUCCESS,
  repositories,
});

const requestFetchDashboardReposError = (errors) => ({
  type: types.REQUEST_FETCH_DASHBOARD_REPOSITORIES_ERROR,
  errors,
});

const requestFetchRepoFilters = () => ({
  type: types.REQUEST_FETCH_REPO_FILTERS,
});

const requestFetchRepoFiltersSuccess = (filters) => ({
  type: types.REQUEST_FETCH_REPO_FILTERS_SUCCESS,
  filters,
});

const requestFetchRepoFiltersError = (errors) => ({
  type: types.REQUEST_FETCH_REPO_FILTERS_ERROR,
  errors,
});

export const requestClearRepoFilters = () => ({
  type: types.REQUEST_CLEAR_REPO_FILTERS,
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
    const {
      response: {
        data: { message },
        status,
        statusText,
      },
    } = error;
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
    const {
      response: {
        data: { message },
        status,
        statusText,
      },
    } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestFetchReposError(errMessage));
  }
};

export const fetchReposByIds = (Ids, token) => async (dispatch) => {
  try {
    dispatch(requestFetchRepos());
    const payload = await getRepos({ Ids }, token);
    const { data: { repositories = [] } } = payload;

    dispatch(requestFetchReposSuccess(repositories));
  } catch (error) {
    const {
      response: {
        data: { message },
        status,
        statusText,
      },
    } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestFetchReposError(errMessage));
  }
};

export const addAnalysis = (repository, token) => async (dispatch) => {
  const {
    _id: repositoryId,
    name,
    legacyId,
    sourceId: { externalSourceId },
  } = repository;
  try {
    dispatch(requestCreateAnalysis());
    const payload = await postAnalysis({
      repositoryId,
      legacyId,
      externalSourceId,
    }, token);
    const { data: { repositories = [] } } = payload;

    dispatch(triggerAlert(`Analysis started for ${name}`, 'success'));

    dispatch(requestCreateAnalysisSuccess(repositories));
  } catch (error) {
    const {
      response: {
        data: { message },
        status,
        statusText,
      },
    } = error;
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
    const {
      response: {
        data: { message },
        status,
        statusText,
      },
    } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestFetchRepoError(errMessage));
    dispatch(triggerAlert(errMessage, 'error'));
  }
};

export const filterSemaRepositories = (externalIds, token) => async (dispatch) => {
  try {
    dispatch(requestFilterSemaRepos());
    const payload = await filterSemaRepos({ externalIds: JSON.stringify(externalIds) }, token);
    const { data: { repositories = [] } } = payload;
    dispatch(requestFilterSemaReposSuccess(repositories));
    return repositories;
  } catch (error) {
    const {
      response: {
        data: { message },
        status,
        statusText,
      },
    } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestFilterSemaReposError(errMessage));
  }
};

export const fetchRepositoryOverview = (externalId, token, dates) => async (dispatch) => {
  try {
    dispatch(requestFetchRepositoryOverview());
    const { data } = await getRepositoryOverview({ externalId, ...dates }, token);
    if (data._id) {
      dispatch(requestFetchRepositoryOverviewSuccess(data));
    }
  } catch (error) {
    const {
      response: {
        data: { message },
        status,
        statusText,
      },
    } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchRepositoryOverviewError(errMessage));
  }
};

export const fetchRepoDashboard = (query, token) => async (dispatch) => {
  const {
    externalIds,
    searchQuery,
  } = query;
  try {
    dispatch(requestFetchDashboardRepos());
    const { data: { repositories = [] } } = await getDashboardRepositories({
      externalIds: JSON.stringify(externalIds),
      searchQuery,
    }, token);
    dispatch(requestFetchDashboardReposSuccess(repositories));
  } catch (error) {
    const {
      response: {
        data: { message },
        status,
        statusText,
      },
    } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchDashboardReposError(errMessage));
  }
};

export const fetchRepoFilters = (repoIds, dateRange, token) => async (dispatch) => {
  try {
    dispatch(requestFetchRepoFilters());
    let dateObj = {}
    if (dateRange.startDate && dateRange.endDate) {
      dateObj = getDateSub(dateRange.startDate, dateRange.endDate);
    }
    const repos = Array.isArray(repoIds) && repoIds.length >= 1 ? repoIds : [repoIds]
    const filterFields = { authors: 1, requesters: 1, pullRequests: 1 };
    const { data } = await getRepositoriesFilters({ externalIds: JSON.stringify(repos), ...dateObj, filterFields }, token)
    dispatch(requestFetchRepoFiltersSuccess(data.filter));
  } catch (error) {
    const errMessage = parseErrorMessage(error)
    dispatch(requestFetchRepoFiltersError(errMessage));
  }
};
