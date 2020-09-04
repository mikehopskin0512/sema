import axios from 'axios';

const isServer = () => typeof window === 'undefined';
const basicAuth = { username: process.env.NEXT_PUBLIC_APOLLO_CLIENT_ID, password: process.env.NEXT_PUBLIC_APOLLO_CLIENT_SECRET };

const api = axios.create({
  baseURL: isServer() ? process.env.NEXT_PUBLIC_INTERNAL_BASE_URL_APOLLO : process.env.NEXT_PUBLIC_BASE_URL_APOLLO,
  withCredentials: true,
  credentials: 'include',
});

export const get = (endpoint, { id }, token = '') => {
  const config = {};
  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  } else {
    config.auth = basicAuth;
  }

  return api.get(`${endpoint}/${id}`, config);
};

export const getAll = (endpoint, { params = {} }, token = '') => {
  const config = {};
  console.log(token);
  if (token) {
    console.log('BEARER');
    config.headers = { Authorization: `Bearer ${token}` };
  } else {
    console.log('BASIC');
    config.auth = basicAuth;
  }

  console.log(endpoint);
  console.log('----------');
  console.log(params);
  console.log(config);
  const mergedConfig = Object.assign({ params }, config);
  console.log(mergedConfig);
  return api.get(endpoint, mergedConfig);
  // return api.get(endpoint, { params, ...config });
};

export const download = (endpoint, { params }, token = '') => {
  const config = {};
  config.responseType = 'blob';

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/pdf',
    };
  } else {
    config.auth = basicAuth;
    config.headers = { Accept: 'application/pdf' };
  }

  return api.get(endpoint, { params, ...config });
};

export const create = (endpoint, item, token = '') => {
  const config = {};
  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  } else {
    config.auth = basicAuth;
  }

  return api.post(endpoint, item, config);
};

export const update = (endpoint, item) => api.put((`${endpoint}/${item.id}`), item);

export const deleteItem = (endpoint, { id }) => api.delete(`${endpoint}/${id}`);