import axios from 'axios';

// Basic auth moved to api/proxy catch-all route
// const isServer = () => typeof window === 'undefined';
// const basicAuth = { username: process.env.NEXT_PUBLIC_APOLLO_CLIENT_ID, password: process.env.NEXT_PUBLIC_APOLLO_CLIENT_SECRET };

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  // baseURL: isServer() ? process.env.NEXT_PUBLIC_INTERNAL_BASE_URL_APOLLO : process.env.NEXT_PUBLIC_BASE_URL_APOLLO,
  withCredentials: true,
  credentials: 'include',
});

export const get = (endpoint, { id }, token = '') => {
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

export const update = (endpoint, item) => api.put((`${endpoint}/${item.id}`), item);

export const deleteItem = (endpoint, { id }) => api.delete(`${endpoint}/${id}`);
