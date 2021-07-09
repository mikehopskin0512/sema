import axios from 'axios';

import { intercomToken } from '../config';
// const intercomToken = 'dG9rOmNlZGFlZmNiXzUzNjZfNDYxNF9iOWQzXzA1ODYzYWY2OTU5MzoxOjA=';

const config = {
  headers: {
    'Authorization': `Bearer ${intercomToken}`,
    'Content-Type': 'application/json',
  },
};

const host = 'https://api.intercom.io';
const api = axios.create({
  baseURL: process !== 'undefined' ? host : null,
});

const get = (endpoint, { id }) => api.get(`${endpoint}/${id}`, config);
const getAll = (endpoint, { params } = {}) => api.get(endpoint, { params, ...config });
const create = (endpoint, item) => api.post(endpoint, item, config);

module.exports = {
  get,
  getAll,
  create,
};
