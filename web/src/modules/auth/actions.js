import Router from 'next/router';
import nextCookie from 'next-cookies';
import cookie from 'js-cookie';

import * as types from './types';
import api from '../../utils/api';

/*
 * Cookie helper methods
 */

export const setCookie = (key, value) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires: 1,
      path: '/',
    });
  }
  return {
    type: types.SET_AUTH_COOKIE,
  };
};

export const removeCookie = (key) => {
  if (process.browser) {
    cookie.remove(key, {
      expires: 1,
    });
  }
};

const getCookieFromBrowser = (key) => {
  return cookie.get(key);
};

const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }
  const rawCookie = req.headers.cookie.split(';').find((c) => c.trim().startsWith(`${key}=`));
  if (!rawCookie) {
    return undefined;
  }
  return rawCookie.split('=')[1];
};

export const getCookie = (key, req) => {
  return process.browser ? getCookieFromBrowser(key) : getCookieFromServer(key, req);
};

const loginRequest = function () {
  return {
    type: types.AUTH_LOGIN_REQUEST,
  };
};

const loginSuccess = function (data) {
  const now = new Date();
  const expires = now.setSeconds(now.getSeconds() + data.expires_in);

  return {
    type: types.AUTH_LOGIN_SUCCESS,
    token: data.token,
    expires,
    user: data,
  };
};

const loginError = function (error) {
  return {
    type: types.AUTH_LOGIN_FAILURE,
    errors: error,
  };
};

const logoutSuccess = function () {
  return {
    type: types.AUTH_LOGOUT_SUCCESS,
  };
};

const loginTokenRequest = function () {
  return {
    type: types.LOGIN_TOKEN_REQUEST,
  };
};

const loginTokenSuccess = function (accessToken) {
  return {
    type: types.LOGIN_TOKEN_SUCCESS,
    token: accessToken,
  };
};

const refreshTokenRequest = function () {
  return {
    type: types.REFRESH_TOKEN_REQUEST,
  };
};

const refreshTokenSuccess = function (data) {
  const now = new Date();
  const expires = now.setSeconds(now.getSeconds() + data.expires_in);

  return {
    type: types.REFRESH_TOKEN_SUCCESS,
    token: data.access_token,
    expires,
  };
};

const refreshTokenError = function (error) {
  return {
    type: types.REFRESH_TOKEN_ERROR,
    errors: (error) && error.data,
  };
};

const requestCurrentUser = function () {
  return {
    type: types.REQUEST_CURRENT_USER,
  };
};

const receiveCurrentUser = function (data) {
  return {
    type: types.RECEIVE_CURRENT_USER,
    data: data.user,
  };
};

const fetchCurrentUserError = function (error) {
  return {
    type: types.REQUEST_CURRENT_USER_ERROR,
    errors: error.data,
  };
};

export function setBasicUser(user) {
  return {
    type: types.SET_BASIC_USER,
    user,
  };
}

export function logout() {
  return function (dispatch) {
    dispatch(logoutSuccess());
    dispatch(Router.push('/login'));
  };
}

const fetchCurrentUser = function (accessToken) {
  return function (dispatch) {
    dispatch(requestCurrentUser());
    api.get('/proxy/v1/endpoint', {}, accessToken)
      .then((res) => {
        dispatch(receiveCurrentUser(res));
      })
      .catch((error) => {
        dispatch(fetchCurrentUserError(error.response));
        dispatch(logout());
      });
  };
};

const shouldFetchCurrentUser = function (state) {
  const { user } = state.auth;
  if (Object.keys(user).length === 0) {
    return true;
  }

  return false;
};

export function fetchCurrentUserIfNeeded(accessToken) {
  return function (dispatch, getState) {
    if (shouldFetchCurrentUser(getState())) {
      return dispatch(fetchCurrentUser(accessToken));
    }

    return false;
  };
}

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      dispatch(loginRequest());
      const res = await api.post('/login', {
        username: email,
        password,
      });

      console.log(res);
      if (res.success) {
        dispatch(setCookie('token', res.token));
        dispatch(loginSuccess(res));
        Router.push('/reports');
      } else {
        console.log(res);
        dispatch(loginError(res.error));
      }
    } catch (error) {
      console.log(error);
      dispatch(loginError(error.response));
    }
  };
};

export function loginViaToken(accessToken) {
  return function (dispatch) {
    dispatch(loginTokenRequest());
    dispatch(loginTokenSuccess(accessToken));
    dispatch(fetchCurrentUser(accessToken));
  };
}

export function refreshToken(refreshToken) {
  return function (dispatch) {
    dispatch(refreshTokenRequest());
    api.post('/proxy/oauth/token', {
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    })
      .then((data) => {
        dispatch(setCookie(data));
        dispatch(refreshTokenSuccess(data));
        // Moved to checkToken.js
        // dispatch(fetchCurrentUser(data.access_token));
      })
      .catch((error) => {
        let err = {};
        if ('response' in error) {
          err = error.response;
        } else if ('error_description' in error) {
          err.error_description = error;
        }
        dispatch(refreshTokenError(err));
        dispatch(logout());
      });
  };
}
