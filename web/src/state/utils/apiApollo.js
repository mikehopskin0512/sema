import axios from 'axios';

const config = {
  auth: {},
  headers: {},
};
const basicAuth = { username: process.env.APOLLO_CLIENT_ID, password: process.env.APOLLO_CLIENT_SECRET };

const api = axios.create({
  baseURL: process !== 'undefined' ? process.env.BASE_URL_APOLLO : null,
});

export const get = (endpoint, { id }, token = '') => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    config.auth = basicAuth;
  }

  return api.get(`${endpoint}/${id}`, config);
};

export const getAll = (endpoint, { params } = {}, token = '') => api.get(endpoint, { params,
  headers: {
    Authorization: `Bearer ${token}`,
  } });

export const download = (endpoint, { params }, token = '') => api.get(endpoint, { params,
  responseType: 'blob',
  headers: {
    Accept: 'application/pdf',
    Authorization: `Bearer ${token}`,
  } });

export const create = (endpoint, item, token = '') => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    config.auth = basicAuth;
  }

  return api.post(endpoint, item, config);
};

export const update = (endpoint, item) => api.put((`${endpoint}/${item.id}`), item);

export const deleteItem = (endpoint, { id }) => api.delete(`${endpoint}/${id}`);
