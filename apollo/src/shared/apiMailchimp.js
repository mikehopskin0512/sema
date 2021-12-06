import axios from 'axios';

import logger from '../shared/logger';
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

const get = (endpoint, { id }) => {
  if (mailchimpServerPrefix && mailchimpToken) {
    api.get(`${endpoint}/${id}`, config);
  } else {
    logger.error('No Mailchimp API tokens present');
  }
};

const getAll = (endpoint, { params } = {}) => {
  if (mailchimpServerPrefix && mailchimpToken) {
    api.get(endpoint, { params, ...config });
  } else {
    logger.error('No Mailchimp API tokens present');
  }
};

const create = (endpoint, item) => {
  if (mailchimpServerPrefix && mailchimpToken) {
    api.post(endpoint, item, config);
  } else {
    logger.error('No Mailchimp API tokens present');
  }
};

const update = (endpoint, item) => {
  if (mailchimpServerPrefix && mailchimpToken) {
    api.put(endpoint, item, config);
  } else {
    logger.error('No Mailchimp API tokens present');
  }
};

module.exports = {
  get,
  getAll,
  create,
  update,
};
