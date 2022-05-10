/* eslint-disable import/no-import-module-exports */
import axios from 'axios';
import logger from "./logger";
import { intercomToken } from '../config';

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

const get = (endpoint, { id }) => {
  if (intercomToken) {
    api.get(`${endpoint}/${id}`, config);
  } else {
    logger.error('No Intercom API token present');
  }
};

const getAll = (endpoint, { params } = {}) => {
  if (intercomToken) {
    return api.get(endpoint, { params, ...config });
  } 
  return logger.error('No Intercom API token present');
}

const create = (endpoint, item) => {
  if (intercomToken) {
    api.post(endpoint, item, config);
  }  else {
    logger.error('No Intercom API token present');
  }
};

module.exports = {
  get,
  getAll,
  create,
};
