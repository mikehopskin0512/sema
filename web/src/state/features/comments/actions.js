/* eslint-disable import/prefer-default-export */
import * as types from "./types";
import { getSmartComments, getAllCollections, getCollection, getSuggestedComments } from "./api";
import { alertOperations } from "../alerts";

const { triggerAlert } = alertOperations;

const fetchCollection = () => ({
  type: types.FETCH_COLLECTION
});

const fetchCollectionSuccess = (collection) => ({
  type: types.FETCH_COLLECTION_SUCCESS,
  collection,
});

const fetchCollectionError = (error) => ({
  type: types.FETCH_COLLECTION_ERROR,
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

export const getUserSuggestedComments = (title, userId, token) => async (dispatch) => {
  try {
    dispatch(fetchUserSuggestedComments(token));
    const { data } = await getSuggestedComments({ q: title, user: userId }, token);
    dispatch(fetchUserSuggestedCommentsSuccess(data.searchResults.result));
  } catch (error) {
    let errMessage = '';
    if (!error.responese) {
      let errMessage = 'unknown error';
    } else {
      const { response: { data: { message }, status, statusText } } = error;
      errMessage = message || `${status} - ${statusText}`;
    }
    dispatch(fetchUserSuggestedCommentsError(errMessage));
  }
};

