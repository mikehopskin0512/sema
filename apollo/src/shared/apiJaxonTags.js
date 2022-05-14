/* eslint-disable import/no-import-module-exports */
import axios from 'axios';

import { jaxon }  from '../config';

const { tagsApi } = jaxon;
const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const host = tagsApi;

const api = axios.create({
  baseURL: process !== 'undefined' ? host : null,
});

export const analyze = (endpoint, comments) => (api.post(endpoint, comments, config));
