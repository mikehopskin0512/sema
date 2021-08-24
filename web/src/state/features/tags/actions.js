/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-cycle */
import {
  getSuggestedCommentTags,
} from './api';
import * as types from './types';

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