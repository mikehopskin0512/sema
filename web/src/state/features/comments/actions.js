/* eslint-disable import/prefer-default-export */
import * as types from './types';
import { getSmartComments } from './api';
import { alertOperations } from '../alerts';

const { triggerAlert } = alertOperations;

const requestGetSmartCommentsByRepo = () => ({
  type: types.REQUEST_GET_SMART_COMMENTS_BY_REPO,
});

const requestGetSmartCommentsByRepoSuccess = (smartComments) => ({
  type: types.REQUEST_GET_SMART_COMMENTS_BY_REPO_SUCCESS,
  smartComments,
});

const requestGetSmartCommentsByRepoError = (errors) => ({
  type: types.REQUEST_GET_SMART_COMMENTS_BY_REPO_ERROR,
  errors,
});

export const fetchSmartComments = (repo, token) => async (dispatch) => {
  try {
    dispatch(requestGetSmartCommentsByRepo());
    const payload = await getSmartComments(repo, token);
    const { data } = payload;
    dispatch(requestGetSmartCommentsByRepoSuccess(data.comments));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestGetSmartCommentsByRepoError(errMessage));
    dispatch(triggerAlert(`${errMessage}`, 'error'));
  }
};
