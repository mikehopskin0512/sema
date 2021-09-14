/* eslint-disable import/prefer-default-export */
import * as types from './types';
import { getSmartComments, getAllSuggestedComments, getCollection, getSmartCommentSummary } from './api';
import { alertOperations } from '../alerts';

const { triggerAlert } = alertOperations;

const fetchCollection = () => ({
  type: types.FETCH_COLLECTION,
});

const fetchCollectionSuccess = (collection) => ({
  type: types.FETCH_COLLECTION_SUCCESS,
  collection,
});

const fetchCollectionError = (error) => ({
  type: types.FETCH_COLLECTION_ERROR,
  error,
});

const fetchSuggestedComments = () => ({
  type: types.FETCH_SUGGESTED_COMMENTS,
});

const fetchSuggestedCommentsSuccess = (comments) => ({
  type: types.FETCH_SUGGESTED_COMMENTS_SUCCESS,
  comments,
});

const fetchSuggestedCommentsError = (error) => ({
  type: types.FETCH_SUGGESTED_COMMENTS_ERROR,
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

export const getUserSuggestedComments = (token) => async (dispatch) => {
  try {
    dispatch(fetchSuggestedComments(token));
    const comments = await getAllSuggestedComments(token);
    dispatch(fetchSuggestedCommentsSuccess(comments.data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(fetchSuggestedCommentsError(errMessage));
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
    dispatch(requestFetchSmartCommentSummary())
    const { data: { summary } } = await getSmartCommentSummary(params, token);
    dispatch(requestFetchSmartCommentSummarySuccess(summary));
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

