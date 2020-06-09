import Router from 'next/router';
import getConfig from 'next/config';
import * as types from './types';
import { auth, createUser } from './api';
import { removeCookie, setCookie } from '../../utils/cookie';

import { alertOperations } from '../alerts';

const { triggerAlert } = alertOperations;

const { publicRuntimeConfig: { NEXT_PUBLIC_AUTH_JWT } } = getConfig();
const authCookie = NEXT_PUBLIC_AUTH_JWT;

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

export const authenticate = (username, password) => async (dispatch) => {
  dispatch(authenticateRequest());
  const res = await auth({ username, password });
  if (res.error) {
    dispatch(authenticateError(res.error));
  }

  // This will be replaced with new backend
  if (res.data.success === false) {
    dispatch(authenticateError(res.data.error));
    dispatch(triggerAlert('Invalid username/password. Please try again.'));
  }

  if (res.data && res.data.token) {
    const { id, organization_id } = res.data;
    setCookie(authCookie, res.data.token);
    dispatch(authenticateSuccess(res.data));
    dispatch(hydrateUser(res.data));

    // Pass custom id and organization_id to Heap
    if (typeof window !== 'undefined') {
      if (id && organization_id) {
        window.heap.identify(id);
        window.heap.addUserProperties({ organization_id });
      }
    }

    Router.push('/reports');
  }
};

const requestRegistration = () => ({
  type: types.REQUEST_REGISTRATION,
});

const registrationSucess = (data) => ({
  type: types.REQUEST_REGISTRATION_SUCCESS,
  user: data.user,
});

const registrationError = (errors) => ({
  type: types.REQUEST_REGISTRATION_ERROR,
  errors,
});

export const registerUser = (user, token) => async (dispatch) => {
  try {
    dispatch(requestRegistration());
    const payload = await createUser(user, token);

    dispatch(registrationSucess(payload.data));
  } catch (error) {
    dispatch(registrationError(error.response.data));
  }
};

export const setUser = function (user) {
  return {
    type: types.SET_USER,
    user,
  };
};
