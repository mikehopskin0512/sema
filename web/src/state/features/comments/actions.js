/* eslint-disable import/prefer-default-export */
import * as types from './types';
import { getAllSuggestedComments, getCollection } from './api';

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
