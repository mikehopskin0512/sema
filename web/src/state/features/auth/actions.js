import Router from 'next/router';
import jwtDecode from 'jwt-decode';
import * as types from './types';
import {
  auth, exchangeToken, createUser,
  postUserOrg, verifyUser, resetVerification,
} from './api';

import { alertOperations } from '../alerts';
import { removeCookie } from '../../utils/cookie';

const { triggerAlert, clearAlert } = alertOperations;
const refreshCookie = process.env.NEXT_PUBLIC_REFRESH_COOKIE;
const isServer = () => typeof window === 'undefined';

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

const userNotVerifiedError = (user) => ({
  type: types.USER_NOT_VERIFIED,
  user,
});

/*const logHeapAnalytics = (userId, orgId) => async (dispatch) => {
  // Pass custom id and organization_id to Heap
  if (typeof window !== 'undefined') {
    if (userId) {
      window.heap.identify(userId);
    }

    // if (organization_id) {
    //   window.heap.addUserProperties({ organization_id });
    // }
  }
};*/

export const authenticate = (username, password) => async (dispatch) => {
    console.log("actions authenticate");
    dispatch(authenticateRequest());
    console.log("actions dispatch");
  try {
    const res = await auth({ username, password });
    const { data: { jwtToken } } = res;
      const { user } = jwtDecode(jwtToken) || {};
      console.log("authenticate user password");
    console.log(user);
    if (user) {
      const { _id: userId, isVerified } = user;
      const orgId = null; // TEMP: Until orgs are linked up

      // Only allow store token if isVerified
      if (isVerified) {
        dispatch(authenticateSuccess(jwtToken));
        Router.push('/reports');
      } else {
        // Auth error clears token but preserves user object
        dispatch(authenticateError({ errors: 'User is not verfied' }));
        Router.push('/register/verify');
      }

      // Hydrate user regardless of isVerified
      dispatch(hydrateUser(user));
      //logHeapAnalytics(userId, orgId);
    }
  } catch (err) {
    const { response: { data: { message } } } = err;
    dispatch(authenticateError(err.response.data));
    dispatch(triggerAlert(message, 'error'));
  }
};

export const refreshJwt = (refreshToken) => async (dispatch) => {
    console.log("refreshJwt");
  dispatch(requestRefreshToken());
    console.log("refreshJwt dispatch");
  try {
    const res = await exchangeToken({ refreshToken });
    const { data: { jwtToken } } = res;
    const { user } = jwtDecode(jwtToken) || {};
    const { isVerified } = user;
    console.log("refreshJwt before send");
    // Send token to state and hydrate user
    dispatch(requestRefreshTokenSuccess(jwtToken));
    dispatch(hydrateUser(user));

    if (!isVerified) {
      dispatch(userNotVerifiedError(user));
      // Need server-side check since this is called from sentry
      if (!isServer) { Router.push('/register/verify'); }
    }
    return { isVerified };
  } catch (err) {
    if (err.response) {
      const { response: { data = {} } } = err;
      dispatch(requestRefreshTokenError(data));
    } else {
      dispatch(requestRefreshTokenError(err));
    }
    return { isVerified: false };
  }
};

const requestRegistration = () => ({
  type: types.REQUEST_REGISTRATION,
});

const registrationSuccess = (token, newUser) => ({
  type: types.REQUEST_REGISTRATION_SUCCESS,
  token,
  user: newUser,
});

const registrationError = (errors) => ({
  type: types.REQUEST_REGISTRATION_ERROR,
  errors,
});

const requestJoinOrg = () => ({
  type: types.REQUEST_JOIN_ORG,
});

const requestJoinOrgSuccess = (token, updatedUser) => ({
  type: types.REQUEST_JOIN_ORG_SUCCESS,
  token,
  user: updatedUser,
});

const requestJoinOrgError = (errors) => ({
  type: types.REQUEST_JOIN_ORG_ERROR,
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

export const registerUser = (user, invitation = {}) => async (dispatch) => {
  try {
    dispatch(requestRegistration());
    const payload = await createUser({ user, invitation });
    const { data: { jwtToken } } = payload;
    const { user: newUser } = jwtDecode(jwtToken) || {};
    dispatch(registrationSuccess(jwtToken, newUser));

    // Send user to /verify landing page while verification email is sent
    Router.push('/register/verify');
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(registrationError(errMessage));
    dispatch(triggerAlert(errMessage, 'error'));
  }
};

export const joinOrg = (userId, org, token) => async (dispatch) => {
  try {
    dispatch(requestJoinOrg());
    const payload = await postUserOrg(userId, { org }, token);
    const { data: { jwtToken } } = payload;
    const { user: updatedUser } = jwtDecode(jwtToken) || {};

    // Send user to reports page after registration & joinOrg
    Router.push('/reports');

    dispatch(requestJoinOrgSuccess(jwtToken, updatedUser));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestJoinOrgError(errMessage));
    dispatch(triggerAlert(errMessage, 'error'));
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
//      logHeapAnalytics(userId, orgId);
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
