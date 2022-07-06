/* eslint-disable import/prefer-default-export */
import * as types from './types';
import { getSmartComments, getAllSuggestedComments, getCollection, getSmartCommentSummary, getSmartCommentOverview, getSuggestedComments, searchSmartComments } from './api';
import { alertOperations } from '../alerts';

const { triggerAlert } = alertOperations;

const fetchCollection = () => ({
  type: types.FETCH_COMMENT_COLLECTION,
});

const fetchCollectionSuccess = (collection) => ({
  type: types.FETCH_COMMENT_COLLECTION_SUCCESS,
  collection,
});

const fetchCollectionError = (error) => ({
  type: types.FETCH_COMMENT_COLLECTION_ERROR,
  error,
});

const fetchUserCollections = () => ({
  type: types.FETCH_USER_COLLECTIONS,
});

const fetchUserCollectionsSuccess = (payload) => ({
  type: types.FETCH_USER_COLLECTIONS_SUCCESS,
  payload,
});

const fetchUserCollectionsError = (error) => ({
  type: types.FETCH_USER_COLLECTIONS_ERROR,
  error,
});

const fetchUserSuggestedComments = () => ({
  type: types.FETCH_USER_SUGGESTED_COMMENTS,
});

const fetchUserSuggestedCommentsSuccess = (payload) => ({
  type: types.FETCH_USER_SUGGESTED_COMMENTS_SUCCESS,
  payload,
});

const fetchUserSuggestedCommentsError = (error) => ({
  type: types.FETCH_USER_SUGGESTED_COMMENTS_ERROR,
  error,
});

const requestFetchSmartComments = () => ({
  type: types.REQUEST_FETCH_SMART_COMMENTS
});

const requestFetchSmartCommentsSuccess = (smartComments) => ({
  type: types.REQUEST_FETCH_SMART_COMMENTS_SUCCESS,
  smartComments
});

const requestFetchSmartCommentsError = (error) => ({
  type: types.REQUEST_FETCH_SMART_COMMENTS_ERROR,
  error
});

const requestFetchSmartCommentSummary = () => ({
  type: types.REQUEST_FETCH_SMART_COMMENT_SUMMARY
});

const requestFetchSmartCommentSummarySuccess = (summary) => ({
  type: types.REQUEST_FETCH_SMART_COMMENT_SUMMARY_SUCCESS,
  summary
});

const requestFetchSmartCommentSummaryError = () => ({
  type: types.REQUEST_FETCH_SMART_COMMENT_SUMMARY_ERROR
});

const requestFetchSmartCommentOverview = () => ({
  type: types.REQUEST_FETCH_SMART_COMMENT_OVERVIEW
});

const requestFetchSmartCommentOverviewSuccess = (overview) => ({
  type: types.REQUEST_FETCH_SMART_COMMENT_OVERVIEW_SUCCESS,
  overview
});

const requestFetchSmartCommentOverviewError = () => ({
  type: types.REQUEST_FETCH_SMART_COMMENT_OVERVIEW_ERROR
});

const requestFilterRepoSmartComments = () => ({
  type: types.REQUEST_FILTER_REPO_SMART_COMMENTS
});

const requestFilterRepoSmartCommentsSuccess = (results) => ({
  type: types.REQUEST_FILTER_REPO_SMART_COMMENTS_SUCCESS,
  results
});

const requestFilterRepoSmartCommentsError = () => ({
  type: types.REQUEST_FILTER_REPO_SMART_COMMENTS_ERROR
});

export const getCollectionById = (id, token) => async (dispatch) => {
  try {
    dispatch(fetchCollection());
    const collection = await getCollection(id, token);
    dispatch(fetchCollectionSuccess(collection.data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(fetchCollectionError(errMessage));
  }
};

export const getUserCollection = (token) => async (dispatch) => {
  try {
    dispatch(fetchUserCollections(token));
    const collections = await getAllCollections(token);
    dispatch(fetchUserCollectionsSuccess(collections.data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(fetchUserCollectionsError(errMessage));
  }
};

export const getUserSuggestedComments = (title, userId, token, isAllCollections = false) => async (dispatch) => {
  try {
    dispatch(fetchUserSuggestedComments(token));
    const { data } = await getSuggestedComments({ q: title, user: userId, allCollections: isAllCollections }, token);
    dispatch(fetchUserSuggestedCommentsSuccess(data.searchResults.result));
  } catch (error) {
    let errMessage = '';
    if (!error.response) {
      let errMessage = 'unknown error';
    } else {
      const { response: { data: { message }, status, statusText } } = error;
      errMessage = message || `${status} - ${statusText}`;
    }
    dispatch(fetchUserSuggestedCommentsError(errMessage));
  }
};

export const fetchSmartComments = (params, token) => async (dispatch) => {
  try {
    dispatch(requestFetchSmartComments())
    const comments = await getSmartComments(params, token);
    dispatch(requestFetchSmartCommentsSuccess(comments.data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchSmartCommentsError(errMessage));
  }
}

export const fetchSmartCommentSummary = (params, token) => async (dispatch) => {
  try {
    dispatch(requestFetchSmartCommentSummary());
    const { data } = await getSmartCommentSummary(params, token);
    dispatch(requestFetchSmartCommentSummarySuccess(data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchSmartCommentSummaryError(errMessage));
  }
};

export const fetchSmartCommentOverview = (params, token) => async (dispatch) => {
  try {
    dispatch(requestFetchSmartCommentOverview())
    const { data: { overview } } = await getSmartCommentOverview(params, token);
    dispatch(requestFetchSmartCommentOverviewSuccess(overview));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchSmartCommentOverviewError(errMessage));
  }
};

export const filterRepoSmartComments = (externalId, token, filter) => async (dispatch) => {
  try {
    dispatch(requestFilterRepoSmartComments());
    const { data } = await searchSmartComments({ repoId: externalId, ...filter }, token);
    dispatch(requestFilterRepoSmartCommentsSuccess(data));
  } catch (error) {
    const {
      response: {
        data: { message },
        status,
        statusText,
      },
    } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFilterRepoSmartCommentsError(errMessage));
  }
};