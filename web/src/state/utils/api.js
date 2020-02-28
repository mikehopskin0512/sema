import axios from 'axios';

const api = axios.create({
  baseURL: process !== 'undefined' ? process.env.BASE_URL : null
});

export const get = (endpoint, {id}) => api.get(`${endpoint}/${id}`);

export const getAll = (endpoint, {params}={}) => api.get(endpoint, {params});

export const create = (endpoint, item) => api.post(endpoint, item);

export const update = (endpoint, item) => api.put((`${endpoint}/${item.id}`), item);

export const deleteItem = (endpoint, {id}) => api.delete(`${endpoint}/${id}`);
