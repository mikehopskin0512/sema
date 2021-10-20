/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-cycle */
import {
  getSuggestedCommentTags,
  addTags
} from './api';
import * as types from './types';
import { alertOperations } from '../alerts';

const { triggerAlert, clearAlert } = alertOperations;

const fetchAllTags = () => ({
  type: types.FETCH_ALL_TAGS,
});

const fetchAllTagsSuccess = (tags) => ({
  type: types.FETCH_ALL_TAGS_SUCCESS,
  tags,
});

const fetchAllTagsError = (errors) => ({
  type: types.FETCH_ALL_TAGS_ERROR,
  errors,
});

const createNewTag = () => ({
  type: types.CREATE_NEW_TAG,
});

const createNewTagSuccess = () => ({
  type: types.CREATE_NEW_TAG_SUCCESS,
});

const createNewTagError = (errors) => ({
  type: types.CREATE_NEW_TAG_ERROR,
  errors,
});

export const fetchTagList = (token) => async (dispatch) => {
  try {
    dispatch(fetchAllTags());
    const payload = await getSuggestedCommentTags(token);
    const { data } = payload;
    dispatch(fetchAllTagsSuccess(data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(fetchAllTagsError(errMessage));
  }
};

export const createTags = (tags, token) => async (dispatch) => {
  try {
    dispatch(createNewTag());
    const payload = await addTags(tags, token);
    const { data } = payload;
    dispatch(triggerAlert('Successfully added tags!', 'success'));
    dispatch(createNewTagSuccess());
    return data;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(triggerAlert('Unable to add tags', 'error'));
    dispatch(createNewTagError(errMessage));
  }
}