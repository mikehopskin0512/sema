import axios from 'axios';

import { getCookie } from './cookie';
import { requestRefreshTokenSuccess } from '../features/auth/actions.js'
import { PATHS } from '../../utils/constants';

const refreshCookie = process.env.NEXT_PUBLIC_REFRESH_COOKIE;

// Basic auth moved to api/proxy catch-all route
// const isServer = () => typeof window === 'undefined';
// const basicAuth = { username: process.env.NEXT_PUBLIC_APOLLO_CLIENT_ID, password: process.env.NEXT_PUBLIC_APOLLO_CLIENT_SECRET };

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  // baseURL: isServer() ? process.env.NEXT_PUBLIC_INTERNAL_BASE_URL_APOLLO : process.env.NEXT_PUBLIC_BASE_URL_APOLLO,
  withCredentials: true,
  credentials: 'include',
});


export const setAxiosInterceptor = ({ dispatch }) => {
  api.interceptors.response.use(null, async (error) => {
    if (error.config && error.response && 'jwt expired' === error.response.data.message) {
      const refreshToken = getCookie(refreshCookie);
      if (refreshToken) {
        try {
          const { data: { jwtToken: newToken } } = await create('/api/proxy/auth/refresh-token', { refreshToken });
          dispatch(requestRefreshTokenSuccess(newToken));
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return axios.request(error.config);
        } catch (err) {
          window.location = PATHS.LOGIN;
        }
      }
    }
    return Promise.reject(error);
  });
}

export const get = (endpoint, id, token = '') => {
  const config = {};
  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  }

  return api.get(`${endpoint}/${id}`, config);
};

export const getAll = (endpoint, { params = {} }, token = '') => {
  const config = {};
  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  }
  return api.get(endpoint, { params, ...config });
};

export const download = (endpoint, { params }, token = '') => {
  const config = {};
  config.responseType = 'blob';

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/pdf',
    };
    config.headers = { Accept: 'application/pdf' };
  }

  return api.get(endpoint, { params, ...config });
};

export const create = (endpoint, item, token = '') => {
  const config = {};
  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  }

  return api.post(endpoint, item, config);
};

export const updateItem = (endpoint, id, item, token = '') => {
  const config = {};
  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  }

  return api.put((`${endpoint}/${id}`), item, config);
};

export const update = (endpoint, item, token = '') => {
  const config = {};
  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  }

  return api.put((`${endpoint}`), item, config);
};

export const patch = (endpoint, params, token = '') => {
  const config = {};
  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  }

  return api.patch(endpoint, params, config);
};

export const deleteItem = (endpoint, id, token = '') => {
  const config = {};
  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  }

  return api.delete(`${endpoint}/${id}`, config);
};

export const exportItem = (endpoint, params, token = '') => {
  const config = {};
  config.responseType = 'blob';

  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  }

  return api.post(endpoint, params, config);
};

