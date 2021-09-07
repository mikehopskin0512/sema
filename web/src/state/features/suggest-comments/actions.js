import {
  getSuggestCommentsReport,
  postSuggestComment,
  patchSuggestComment,
  bulkCreateSuggestedCommentsApi,
  bulkUpdateSuggestedCommentsApi,
  getSuggestCommentsApi,
} from './api';
import * as types from './types';
import { alertOperations } from '../alerts';

const { triggerAlert } = alertOperations;

const requestFetchSuggestComments = () => ({
  type: types.REQUEST_FETCH_SUGGEST_COMMENTS,
});

const requestFetchSuggestCommentsSuccess = (suggestedComments, totalCount) => ({
  type: types.REQUEST_FETCH_SUGGEST_COMMENTS_SUCCESS,
  suggestedComments,
  totalCount,
});

const requestFetchSuggestCommentsError = (errors) => ({
  type: types.REQUEST_FETCH_SUGGEST_COMMENTS_ERROR,
  errors,
});

const requestCreateSuggestComment = () => ({
  type: types.REQUEST_CREATE_SUGGEST_COMMENT,
});

const requestCreateSuggestCommentSuccess = (suggestedComment) => ({
  type: types.REQUEST_CREATE_SUGGEST_COMMENT_SUCCESS,
  suggestedComment,
});

const requestCreateSuggestCommentError = (errors) => ({
  type: types.REQUEST_CREATE_SUGGEST_COMMENT_ERROR,
  errors,
});

const requestUpdateSuggestComment = () => ({
  type: types.REQUEST_UPDATE_SUGGEST_COMMENT,
});

const requestUpdateSuggestCommentSuccess = (suggestedComment) => ({
  type: types.REQUEST_UPDATE_SUGGEST_COMMENT_SUCCESS,
  suggestedComment,
});

const requestUpdateSuggestCommentError = (errors) => ({
  type: types.REQUEST_UPDATE_SUGGEST_COMMENT_ERROR,
  errors,
});

const requestBulkCreateSuggestComment = () => ({
  type: types.REQUEST_BULK_CREATE_SUGGEST_COMMENT,
});

const requestBulkCreateSuggestCommentSuccess = (suggestedComment) => ({
  type: types.REQUEST_BULK_CREATE_SUGGEST_COMMENT_SUCCESS,
  suggestedComment,
});

const requestBulkCreateSuggestCommentError = (errors) => ({
  type: types.REQUEST_BULK_CREATE_SUGGEST_COMMENT_ERROR,
  errors,
});

const requestBulkUpdateSuggestComment = () => ({
  type: types.REQUEST_BULK_UPDATE_SUGGEST_COMMENT,
});

const requestBulkUpdateSuggestCommentSuccess = (suggestedComment) => ({
  type: types.REQUEST_BULK_UPDATE_SUGGEST_COMMENT_SUCCESS,
  suggestedComment,
});

const requestBulkUpdateSuggestCommentError = (errors) => ({
  type: types.REQUEST_BULK_UPDATE_SUGGEST_COMMENT_ERROR,
  errors,
});

const requestGetSuggestComments = () => ({
  type: types.REQUEST_GET_SUGGEST_COMMENTS,
});

const requestGetSuggestCommentsSuccess = (suggestedComments, totalCount) => ({
  type: types.REQUEST_GET_SUGGEST_COMMENTS_SUCCESS,
  suggestedComments,
  totalCount,
});

const requestGetSuggestCommentsError = (errors) => ({
  type: types.REQUEST_GET_SUGGEST_COMMENTS_ERROR,
  errors,
});

export const fetchSuggestComments = (params = {}, token) => async (dispatch) => {
  try {
    dispatch(requestFetchSuggestComments());
    const payload = await getSuggestCommentsReport(params, token);
    const { data: { suggestedComments = [], totalCount } } = payload;

    dispatch(requestFetchSuggestCommentsSuccess(suggestedComments, totalCount));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestFetchSuggestCommentsError(errMessage));
  }
};

export const createSuggestComment = (body, token) => async (dispatch) => {
  try {
    dispatch(requestCreateSuggestComment());
    const { data: { suggestedComment } } = await postSuggestComment(body, token);
    dispatch(triggerAlert('Suggested comment has been added', 'success'));
    dispatch(requestCreateSuggestCommentSuccess(suggestedComment));
    return suggestedComment;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(triggerAlert('Error saving suggested comment', 'error'));
    dispatch(requestCreateSuggestCommentError(errMessage));
    return error;
  }
};

export const updateSuggestComment = (id, body, token) => async (dispatch) => {
  try {
    dispatch(requestUpdateSuggestComment());
    const { data: { suggestedComment } } = await patchSuggestComment(id, body, token);
    dispatch(triggerAlert('Suggested comment has been updated', 'success'));
    dispatch(requestUpdateSuggestCommentSuccess(suggestedComment));
    return suggestedComment;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(triggerAlert('Error saving suggested comment', 'error'));
    dispatch(requestUpdateSuggestCommentError(errMessage));
    return error;
  }
};

export const bulkCreateSuggestedComments = (params, token) => async (dispatch) => {
  try {
    dispatch(requestBulkCreateSuggestComment());
    const res = await bulkCreateSuggestedCommentsApi(params, token);
    if (res.data) {
      dispatch(requestBulkCreateSuggestCommentSuccess(res.data));
    }
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestBulkCreateSuggestCommentError(errMessage));
  }
};

export const bulkUpdateSuggestedComments = (params, token) => async (dispatch) => {
  try {
    dispatch(requestBulkUpdateSuggestComment());
    const res = await bulkUpdateSuggestedCommentsApi(params, token);
    if (res.data) {
      dispatch(requestBulkUpdateSuggestCommentSuccess(res.data));
    }
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestBulkUpdateSuggestCommentError(errMessage));
  }
};

export const getAllSuggestComments = (params = {}, token) => async (dispatch) => {
  try {
    dispatch(requestGetSuggestComments());
    const payload = await getSuggestCommentsApi(params, token);
    const { data: { suggestedComments = [], totalCount } } = payload;

    dispatch(requestGetSuggestCommentsSuccess(suggestedComments, totalCount));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestGetSuggestCommentsError(errMessage));
  }
};
