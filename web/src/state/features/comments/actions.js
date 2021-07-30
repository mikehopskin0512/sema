/* eslint-disable import/prefer-default-export */
import * as types from './types';
import { getSmartComments, getAllSuggestedComments, getCollection } from './api';
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

const requestGetSmartCommentsByRepo = () => ({
  type: types.REQUEST_GET_SMART_COMMENTS_BY_REPO,
});

const requestGetSmartCommentsByRepoSuccess = (smartComments) => ({
  type: types.REQUEST_GET_SMART_COMMENTS_BY_REPO_SUCCESS,
  smartComments,
});

const requestGetSmartCommentsByRepoError = (errors) => ({
  type: types.REQUEST_GET_SMART_COMMENTS_BY_REPO_ERROR,
  errors,
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

export const fetchSmartComments = (repo) => async (dispatch) => {
  try {
    dispatch(requestGetSmartCommentsByRepo());
    const payload = await getSmartComments(repo);
    const { data } = payload;
    dispatch(requestGetSmartCommentsByRepoSuccess(data.comments));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestGetSmartCommentsByRepoError(errMessage));
    dispatch(triggerAlert(`${errMessage}`, 'error'));
  }
};
