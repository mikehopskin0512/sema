import * as types from './types';
import { getCollectionByAuthor, getAllUserCollections, postCollections } from './api';

const requestCreateCollections = () => ({
  type: types.REQUEST_CREATE_COLLECTIONS,
});

const requestCreateCollectionsSuccess = (collections) => ({
  type: types.REQUEST_CREATE_COLLECTIONS_SUCCESS,
  collections,
});

const requestCreateCollectionsError = (errors) => ({
  type: types.REQUEST_CREATE_COLLECTIONS_ERROR,
  errors,
});

const requestFindCollectionsByAuthor = () => ({
  type: types.REQUEST_FIND_COLLECTIONS_BY_AUTHOR,
});

const requestFindCollectionsByAuthorSuccess = (collections) => ({
  type: types.REQUEST_FIND_COLLECTIONS_BY_AUTHOR_SUCCESS,
  collections,
});

const requestFindCollectionsByAuthorError = (errors) => ({
  type: types.REQUEST_FIND_COLLECTIONS_BY_AUTHOR_ERROR,
  errors,
});

const requestFetchAllUserCollections = () => ({
  type: types.REQUEST_FETCH_ALL_USER_COLLECTIONS,
});

const requestFetchAllUserCollectionsSuccess = (collections) => ({
  type: types.REQUEST_FETCH_ALL_USER_COLLECTIONS_SUCCESS,
  collections,
});

const requestFetchAllUserCollectionsError = (errors) => ({
  type: types.REQUEST_FETCH_ALL_USER_COLLECTIONS_ERROR,
  errors,
});

export const createCollections = (collectionsData, token) => async (dispatch) => {
  try {
    dispatch(requestCreateCollections());
    const { data: { collections } } = await postCollections(collectionsData, token);

    dispatch(requestCreateCollectionsSuccess(collections));
    return collections;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestCreateCollectionsError(errMessage));
    return error.response;
  }
};

export const findCollectionsByAuthor = (author, token) => async (dispatch) => {
  try {
    dispatch(requestFindCollectionsByAuthor());
    const { data: { collections } } = await getCollectionByAuthor(author, token);
    dispatch(requestFindCollectionsByAuthorSuccess(collections));
    return collections;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFindCollectionsByAuthorError(errMessage));
    return error.response;
  }
};

export const fetchAllUserCollections = (token) => async (dispatch) => {
  try {
    dispatch(requestFetchAllUserCollections());
    const collections = await getAllUserCollections(token);
    dispatch(requestFetchAllUserCollectionsSuccess(collections.data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchAllUserCollectionsError(errMessage));
  }
};
