import axios from 'axios';

import { modeKey, modeSecret } from '../../config';

const config = {
  auth: { username: modeKey, password: modeSecret },
  headers: {
    'Content-Type': 'application/json',
  },
};

const host = 'https://app.mode.com';
const api = axios.create({
  baseURL: process !== 'undefined' ? host : null,
});

export const get = (endpoint, { id }) => api.get(`${endpoint}/${id}`, config);
export const getAll = (endpoint, { params } = {}) => api.get(endpoint, { params, ...config });
