import { getSuggestComments } from './api';
import * as types from './types';

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
