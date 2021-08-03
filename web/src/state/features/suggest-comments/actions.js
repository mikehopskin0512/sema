import { getSuggestComments, postSuggestComment } from './api';
import * as types from './types';
import { alertOperations } from '../alerts';

const { triggerAlert } = alertOperations;

const requestFetchSuggestComments = () => ({
  type: types.REQUEST_FETCH_SUGGEST_COMMENTS,
});

const requestFetchSuggestCommentsSuccess = (suggestedComments, totalCount) => ({
  type: types.REQUEST_FETCH_SUGGEST_COMMENTS_SUCCESS,
  suggestedComments,
  totalCount
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

export const fetchSuggestComments = (params = {}, token) => async (dispatch) => {
  try {
    dispatch(requestFetchSuggestComments());
    const payload = await getSuggestComments(params, token);
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
