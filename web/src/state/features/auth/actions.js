import * as types from './types';

const loginRequest = () => ({
  type: types.AUTH_LOGIN_REQUEST,
});

const loginSuccess = (user) => ({
  type: types.AUTH_LOGIN_SUCCESS,
  token: data.token,
  user,
});

const loginError = (errors) => ({
  type: types.AUTH_LOGIN_FAILURE,
  errors,
});

const logoutSuccess = () => ({
  type: types.AUTH_LOGOUT_SUCCESS,
});

const loginTokenRequest = () => ({
  type: types.LOGIN_TOKEN_REQUEST,
});

const loginTokenSuccess = (token) => ({
  type: types.LOGIN_TOKEN_SUCCESS,
  token,
});

const refreshTokenRequest = () => ({
  type: types.REFRESH_TOKEN_REQUEST,
});

const refreshTokenSuccess = (data) => {
  const now = new Date();
  const expires = now.setSeconds(now.getSeconds() + data.expires_in);

  return {
    type: types.REFRESH_TOKEN_SUCCESS,
    token: data.access_token,
    expires,
  }
}

const refreshTokenError = (error) => ({
  type: types.REFRESH_TOKEN_ERROR,
  errors: (error) && error.data,
});

const requestCurrentUser = () => ({
  type: types.REQUEST_CURRENT_USER,
});

const receiveCurrentUser = (data) => ({
  type: types.RECEIVE_CURRENT_USER,
  data: data.user,
});

const fetchCurrentUserError = (error) => ({
  type: types.REQUEST_CURRENT_USER_ERROR,
  errors: error.data,
});

export const setBasicUser = (user) => ({
  type: types.SET_BASIC_USER,
  user,
});

export const logout = () => (dispatch) => {
  removeCookie('sema_token');
  dispatch(logoutSuccess());
  Router.push('/login');
}

const fetchCurrentUser = (accessToken) => {
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
  }
}

const shouldFetchCurrentUser = (state) => {
  const { user } = state.auth;
  if (Object.keys(user).length === 0) {
    return true;
  }

  return false;
}

export const fetchCurrentUserIfNeeded = (accessToken) => {
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
        setCookie('sema_token', res.token);
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
  }
}

export const loginViaToken = (accessToken) => {
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
