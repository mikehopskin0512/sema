import axios from 'axios';

const api = axios.create({
  baseURL: process !== 'undefined' ? process.env.BASE_URL : null,
});

export const get = (endpoint, { id }, token) => api.get(`${endpoint}/${id}`, {
  headers: {
    Authorization: `Bearer ${token || ''}`,
  },
});

export const getAll = (endpoint, { params } = {}, token) => api.get(endpoint, { params,
  headers: {
    Authorization: `Bearer ${token || ''}`,
  } });

export const create = (endpoint, item) => api.post(endpoint, item);

export const update = (endpoint, item) => api.put((`${endpoint}/${item.id}`), item);

export const deleteItem = (endpoint, { id }) => api.delete(`${endpoint}/${id}`);
