import Router from 'next/router';
import * as types from './types';
// import api from '../../utils/api';

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
    token: data.access_token,
    expires,
  };
};

const loginError = function (error) {
  return {
    type: types.AUTH_LOGIN_FAILURE,
    errors: (error) && error.data,
  };
};

const logoutSuccess = function () {
  const cookies = new Cookies();
  let domain = '';
  if (typeof document !== 'undefined') {
    domain = tld.getDomain(document.location.hostname);
  }

  if (domain === 'localhost') {
    cookies.remove('sema_at', { path: '/' });
    cookies.remove('sema_rt', { path: '/' });
  } else {
    cookies.remove('sema_at', { domain: '.semasoftware.com', path: '/' });
    cookies.remove('sema_rt', { domain: '.semasoftware.com', path: '/' });
  }

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

export const login = (email, password) => async (dispatch) => {
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
      // dispatch(Router.push('/'));
    } else {
      console.log(res);
      dispatch(loginError(res.error));
    }
  } catch (error) {
    console.log(error);
    dispatch(loginError(error.response));
  }
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
