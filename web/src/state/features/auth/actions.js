import Router from 'next/router';
import * as types from './types';
import { auth } from './api';
import { removeCookie, setCookie } from '../../utils/cookie';

const authCookie = process.env.AUTH_JWT;

const authenticateRequest = () => ({
  type: types.AUTHENTICATE_REQUEST,
});

const authenticateSuccess = (data) => ({
  type: types.AUTHENTICATE,
  token: data.token,
});

const authenticateError = (errors) => ({
  type: types.AUTHENTICATE_FAILURE,
  errors,
});

export const authenticate = (username, password) => async (dispatch) => {
  dispatch(authenticateRequest());
  const res = await auth({ username, password });
  if (res.error) {
    dispatch(authenticateError(res.error));
  }
  if (res.data && res.data.token) {
    setCookie(authCookie, res.data.token);
    dispatch(authenticateSuccess(res.data));
    dispatch(hydrateUser(res.data));
    Router.push('/reports');
  }
};

export const hydrateUser = (data) => ({
  type: types.HYDRATE_USER,
  user: data,
});

export const reauthenticate = (token) => ({
  type: types.AUTHENTICATE,
  token,
});

export const deauthenticate = () => (dispatch) => {
  removeCookie(authCookie);
  Router.push('/');
  dispatch({ type: types.DEAUTHENTICATE });
};
