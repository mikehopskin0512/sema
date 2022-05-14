/* eslint-disable import/no-import-module-exports */
import axios from 'axios';

import { jaxon }  from '../config';

const { summariesApi } = jaxon;
const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const host = summariesApi;

const api = axios.create({
  baseURL: process !== 'undefined' ? host : null,
});

export const analyze = (endpoint, comments) => (api.post(endpoint, comments, config));
