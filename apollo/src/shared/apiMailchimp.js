import axios from 'axios';

import { mailchimpServerPrefix } from '../config';
import { mailchimpToken } from '../config';

const config = {
  headers: {
    'Authorization': `Bearer ${mailchimpToken}`,
    'Content-Type': 'application/json',
  },
};

const host = `https://${mailchimpServerPrefix}.api.mailchimp.com/3.0/`;
const api = axios.create({
  baseURL: process !== 'undefined' ? host : null,
});

const get = (endpoint, { id }) => api.get(`${endpoint}/${id}`, config);
const getAll = (endpoint, { params } = {}) => api.get(endpoint, { params, ...config });
const create = (endpoint, item) => api.post(endpoint, item, config);
const update = (endpoint, item) => api.put(endpoint, item, config);

module.exports = {
  get,
  getAll,
  create,
  update,
};
