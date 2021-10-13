/* eslint-disable import/no-cycle */
import {
  getUser,
} from './api';
import * as types from './types';

const requestFetchUser = () => ({
  type: types.REQUEST_FETCH_USER,
});

const requestFetchUserSuccess = (user) => ({
  type: types.REQUEST_FETCH_USER_SUCCESS,
  user,
});

const requestFetchUserError = (errors) => ({
  type: types.REQUEST_FETCH_USER_ERROR,
  errors,
});

export const fetchUser = (id, token) => async (dispatch) => {
  try {
    dispatch(requestFetchUser());
    const payload = await getUser(id, token);
    const { data } = payload;
    dispatch(requestFetchUserSuccess(data));
    return data;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestFetchUserError(errMessage));
  }
};