import Router from 'next/router';
import jwtDecode from 'jwt-decode';
import * as types from './types';
import { auth, exchangeToken, createUser } from './api';

import { alertOperations } from '../alerts';

const { triggerAlert } = alertOperations;

const authenticateRequest = () => ({
  type: types.AUTHENTICATE_REQUEST,
});

const authenticateSuccess = (token) => ({
  type: types.AUTHENTICATE,
  token,
});

const authenticateError = (errors) => ({
  type: types.AUTHENTICATE_FAILURE,
  errors,
});

export const hydrateUser = (user) => ({
  type: types.HYDRATE_USER,
  user,
});

export const reauthenticate = (token) => ({
  type: types.AUTHENTICATE,
  token,
});

export const deauthenticate = () => (dispatch) => {
  Router.push('/login');
  dispatch(triggerAlert('You have succesfully logged out', 'success'));
  dispatch({ type: types.DEAUTHENTICATE });
};

const requestRefreshToken = () => ({
  type: types.REQUEST_REFRESH_TOKEN,
});

const requestRefreshTokenSuccess = (token) => ({
  type: types.RECEIVE_REFRESH_TOKEN_SUCCESS,
  token,
});

const requestRefreshTokenError = (errors) => ({
  type: types.RECEIVE_REFRESH_TOKEN_ERROR,
  errors,
});

export const authenticate = (username, password) => async (dispatch) => {
  dispatch(authenticateRequest());
  try {
    const res = await auth({ username, password });
    const { data: { jwtToken } } = res;
    const { user } = jwtDecode(jwtToken) || {};

    if (user) {
      const { _id: userId } = user;
      dispatch(authenticateSuccess(jwtToken));
      dispatch(hydrateUser(user));

      // Pass custom id and organization_id to Heap
      if (typeof window !== 'undefined') {
        if (userId) {
          window.heap.identify(userId);
        }

        // if (organization_id) {
        //   window.heap.addUserProperties({ organization_id });
        // }
      }

      Router.push('/reports');
    }
  } catch (err) {
    const { response: { data: { message } } } = err;
    dispatch(authenticateError(err.response.data));
    dispatch(triggerAlert(message, 'error'));
  }
};

export const refreshJwt = (refreshToken) => async (dispatch) => {
  dispatch(requestRefreshToken());

  try {
    const res = await exchangeToken({ refreshToken });
    const { data: { jwtToken } } = res;
    const { user } = jwtDecode(jwtToken) || {};

    // Send token to state and hydrate user
    dispatch(requestRefreshTokenSuccess(jwtToken));
    dispatch(hydrateUser(user));
  } catch (err) {
    const { response: { data: { message } } } = err;
    dispatch(requestRefreshTokenError(err.response.data));
    dispatch(triggerAlert(message, 'error'));
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
