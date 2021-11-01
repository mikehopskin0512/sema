/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-cycle */
import {
  getSuggestedCommentTags,
  addTags,
  getTagById,
  deleteTag,
  putTag
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

const fetchTagById = () => ({
  type: types.FETCH_TAG_BY_ID,
});

const fetchTagByIdSuccess = (tag) => ({
  type: types.FETCH_TAG_BY_ID_SUCCESS,
  tag,
});

const fetchTagByIdError = (errors) => ({
  type: types.FETCH_TAG_BY_ID_ERROR,
  errors,
});

const removeTag = () => ({
  type: types.REMOVE_TAG,
});

const removeTagSuccess = () => ({
  type: types.REMOVE_TAG_SUCCESS,
});

const removeTagError = (errors) => ({
  type: types.REMOVE_TAG_ERROR,
  errors,
});

const updateTag = () => ({
  type: types.UPDATE_TAG,
});

const updateTagSuccess = () => ({
  type: types.UPDATE_TAG_SUCCESS,
});

const updateTagError = (errors) => ({
  type: types.UPDATE_TAG_ERROR,
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

export const fetchTagsById = (id, token) => async (dispatch) => {
  try {
    dispatch(fetchTagById());
    const payload = await getTagById(id, token);
    const { data } = payload;
    dispatch(fetchTagByIdSuccess(data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(fetchTagByIdError(errMessage));
  }
};

export const removeTagById = (id, token) => async (dispatch) => {
  try {
    dispatch(removeTag());
    await deleteTag(id, token);
    dispatch(triggerAlert('Successfully deleted tag', 'success'));
    dispatch(removeTagSuccess());
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(triggerAlert('Unable to delete tag', 'error'));
    dispatch(removeTagError(errMessage));
  }
};

export const updateTagById = (id, body, token) => async (dispatch) => {
  try {
    dispatch(updateTag());
    await putTag(id, body, token);
    dispatch(triggerAlert('Successfully updated tag', 'success'));
    dispatch(updateTagSuccess());
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(triggerAlert('Unable to update tag', 'error'));
    dispatch(updateTagError(errMessage));
  }
};