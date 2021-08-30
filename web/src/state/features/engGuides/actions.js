/* eslint-disable import/prefer-default-export */
import { find, flatten, size, uniqBy } from 'lodash';
import * as types from './types';
import { getAllEngGuides, bulkCreateEngGuidesApi, bulkUpdateEngGuidesApi } from './api';

const fetchEngGuides = () => ({
  type: types.FETCH_ENG_GUIDES,
});

const fetchEngGuidesSuccess = (engGuides) => ({
  type: types.FETCH_ENG_GUIDES_SUCCESS,
  engGuides,
});

const fetchEngGuidesError = (error) => ({
  type: types.FETCH_ENG_GUIDES_ERROR,
  error,
});

const requestBulkCreateEngGuides = () => ({
  type: types.BULK_CREATE_ENG_GUIDES,
});

const requestBulkCreateEngGuidesSuccess = (engGuides) => ({
  type: types.BULK_CREATE_ENG_GUIDES_SUCCESS,
  engGuides,
});

const requestBulkCreateEngGuidesError = (error) => ({
  type: types.BULK_CREATE_ENG_GUIDES_ERROR,
  error,
});

const requestBulkUpdateEngGuides = () => ({
  type: types.BULK_UPDATE_ENG_GUIDES,
});

const requestBulkUpdateEngGuidesSuccess = (engGuides) => ({
  type: types.BULK_UPDATE_ENG_GUIDES_SUCCESS,
  engGuides,
});

const requestBulkUpdateEngGuidesError = (error) => ({
  type: types.BULK_UPDATE_ENG_GUIDES_ERROR,
  error,
});

export const getEngGuides = (token, params) => async (dispatch) => {
  try {
    dispatch(fetchEngGuides());
    const engGuides = await getAllEngGuides(token, params);
    if (engGuides.data) {
      const { data } = engGuides;
      const engGuideCollections = uniqBy(flatten(data.map((item) => item.collections)), '_id');
      const collectionsWithCommentCount = engGuideCollections.map((item) => {
        const { _id } = item;
        const commentCount = data.filter((guide) => size(find(guide.collections, { _id })) > 0);
        return {
          collectionData: {
            ...item,
            comments: commentCount,
          },
        };
      });
      dispatch(fetchEngGuidesSuccess(collectionsWithCommentCount));
    }
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(fetchEngGuidesError(errMessage));
  }
};

export const bulkCreateEngGuides = (params, token) => async (dispatch) => {
  try {
    dispatch(requestBulkCreateEngGuides());
    const res = await bulkCreateEngGuidesApi(params, token);
    if (res.data) {
      dispatch(requestBulkCreateEngGuidesSuccess(res.data));
    }
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestBulkCreateEngGuidesError(errMessage));
  }
};

export const bulkUpdateEngGuides = (params, token) => async (dispatch) => {
  try {
    dispatch(requestBulkUpdateEngGuides());
    const res = await bulkUpdateEngGuidesApi(params, token);
    if (res.data) {
      dispatch(requestBulkUpdateEngGuidesSuccess(res.data));
    }
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestBulkUpdateEngGuidesError(errMessage));
  }
};
