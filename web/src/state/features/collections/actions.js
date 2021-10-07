import * as types from './types';
import { getCollection, getCollectionByAuthor, getAllUserCollections, postCollections, putCollection } from './api';

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

const requestFetchCollection = () => ({
  type: types.FETCH_COLLECTION,
});

const requestFetchCollectionSuccess = (collection) => ({
  type: types.FETCH_COLLECTION_SUCCESS,
  collection,
});

const requestFetchCollectionError = (errors) => ({
  type: types.FETCH_COLLECTION_ERROR,
  errors,
});

const requestUpdateCollection = () => ({
  type: types.REQUEST_UPDATE_COLLECTION,
});

const requestUpdateCollectionSuccess = (collection) => ({
  type: types.REQUEST_UPDATE_COLLECTION_SUCCESS,
  collection,
});

const requestUpdateCollectionError = (errors) => ({
  type: types.REQUEST_UPDATE_COLLECTION_ERROR,
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

export const fetchCollectionById = (id, token) => async (dispatch) => {
  try {
    dispatch(requestFetchCollection());
    const collection = await getCollection(id, token);
    dispatch(requestFetchCollectionSuccess(collection.data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchCollectionError(errMessage));
  }
};

export const updateCollection = (id, collection, token) => async (dispatch) => {
  try {
    dispatch(requestUpdateCollection());
    const updatedCollection = await putCollection(id, collection, token);
    dispatch(requestUpdateCollectionSuccess(updatedCollection.data));
    return updatedCollection.data;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestUpdateCollectionError(errMessage));
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
