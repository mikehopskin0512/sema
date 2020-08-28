import Router from 'next/router';
import jwtDecode from 'jwt-decode';
import * as types from './types';
import {
  auth, exchangeToken, createUser,
  verifyUser, resetVerification,
} from './api';

import { alertOperations } from '../alerts';
import { removeCookie } from '../../utils/cookie';

const { triggerAlert, clearAlert } = alertOperations;
const refreshCookie = process.env.NEXT_PUBLIC_REFRESH_COOKIE;

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
  removeCookie(refreshCookie);
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

const logHeapAnalytics = (userId, orgId) => async (dispatch) => {
  // Pass custom id and organization_id to Heap
  if (typeof window !== 'undefined') {
    if (userId) {
      window.heap.identify(userId);
    }

    // if (organization_id) {
    //   window.heap.addUserProperties({ organization_id });
    // }
  }
};

export const authenticate = (username, password) => async (dispatch) => {
  dispatch(authenticateRequest());
  try {
    const res = await auth({ username, password });
    const { data: { jwtToken } } = res;
    const { user } = jwtDecode(jwtToken) || {};

    if (user) {
      const { _id: userId, isVerified } = user;
      const orgId = null; // TEMP: Until orgs are linked up
      dispatch(authenticateSuccess(jwtToken));
      dispatch(hydrateUser(user));
      logHeapAnalytics(userId, orgId);

      // Only allow user login if isVerified
      if (isVerified) {
        Router.push('/reports');
      } else {
        dispatch(authenticateError({ errors: 'User is not verfied' }));
        Router.push('/register/verify');
      }
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
    const { isVerified } = user;

    // Send token to state and hydrate user
    dispatch(requestRefreshTokenSuccess(jwtToken));
    dispatch(hydrateUser(user));

    if (!isVerified) {
      dispatch(authenticateError({ errors: 'User is not verfied' }));
      Router.push('/register/verify');
    }
  } catch (err) {
    if (err.response) {
      const { response: { data = {} } } = err;
      dispatch(requestRefreshTokenError(data));
    } else {
      dispatch(requestRefreshTokenError(err));
    }
  }
};

const requestRegistration = () => ({
  type: types.REQUEST_REGISTRATION,
});

const registrationSuccess = (data) => ({
  type: types.REQUEST_REGISTRATION_SUCCESS,
  user: data.user,
});

const registrationError = (errors) => ({
  type: types.REQUEST_REGISTRATION_ERROR,
  errors,
});

const requestVerifyUser = () => ({
  type: types.REQUEST_VERIFY_USER,
});

const verifyUserSuccess = () => ({
  type: types.VERIFY_USER_SUCCESS,
});

const verifyUserError = (errors) => ({
  type: types.VERIFY_USER_ERROR,
  errors,
});

const requestResetVerification = () => ({
  type: types.REQUEST_RESET_VERIFICATION,
});

const resetVerificationSuccess = () => ({
  type: types.RESET_VERIFICATION_SUCCESS,
});

const resetVerificationError = (errors) => ({
  type: types.RESET_VERIFICATION_ERROR,
  errors,
});

export const registerUser = (user) => async (dispatch) => {
  try {
    dispatch(requestRegistration());
    const payload = await createUser(user);
    // Send user to verification page after registration
    Router.push('/register/verify');

    dispatch(registrationSuccess(payload.data));
  } catch (error) {
    const { response: { data } } = error;
    dispatch(registrationError(data));
    dispatch(triggerAlert(data.message, 'error'));
  }
};

export const activateUser = (verifyToken) => async (dispatch) => {
  try {
    dispatch(requestVerifyUser());
    const payload = await verifyUser({}, verifyToken);

    // Auto login user
    const { data: { jwtToken } } = payload;
    const { user } = jwtDecode(jwtToken) || {};

    if (user) {
      const { _id: userId } = user;
      const orgId = null; // TEMP: Until orgs are linked up
      dispatch(authenticateSuccess(jwtToken));
      dispatch(hydrateUser(user));
      logHeapAnalytics(userId, orgId);
    }

    dispatch(verifyUserSuccess());
  } catch (error) {
    dispatch(verifyUserError(error.response));
    dispatch(triggerAlert('Invalid verification token. Please request a new one below.', 'error'));
  }
};

export const resendVerifiction = (username) => async (dispatch) => {
  try {
    dispatch(requestResetVerification());
    await resetVerification({ username });

    dispatch(resetVerificationSuccess());
    dispatch(triggerAlert('Verifcation Email resent. Please check your email.', 'success'));
    dispatch(clearAlert());
  } catch (error) {
    dispatch(resetVerificationError(error.response.data));
  }
};

export const setUser = function (user) {
  return {
    type: types.SET_USER,
    user,
  };
};
