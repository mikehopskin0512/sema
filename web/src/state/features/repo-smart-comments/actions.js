import Router from 'next/router';
import * as types from './types';
import { searchRepositorySmartComments } from './api';

const requestSearchRepoSmartComments = () => ({
  type: types.REQUEST_SEARCH_REPO_SMART_COMMENTS,
});

const requestSearchRepoSmartCommentsSuccess = (overview) => ({
  type: types.REQUEST_SEARCH_REPO_SMART_COMMENTS_SUCCESS,
  overview,
});

const requestSearchRepoSmartCommentsError = (errors) => ({
  type: types.REQUEST_SEARCH_REPO_SMART_COMMENTS_ERROR,
  errors,
});

export const searchRepoSmartComments = (externalId, token, dates) => async (dispatch) => {
  try {
    dispatch(requestSearchRepoSmartComments());
    const { data } = await searchRepositorySmartComments({ repoId: externalId, ...dates }, token);
    dispatch(requestSearchRepoSmartCommentsSuccess(data));
  } catch (error) {
    const {
      response: {
        data: { message },
        status,
        statusText,
      },
    } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestSearchRepoSmartCommentsError(errMessage));
  }
};
