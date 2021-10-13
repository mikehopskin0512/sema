import axios from 'axios';

import { iframelyApiKey } from '../config';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const api = axios.create({
  baseURL: 'https://iframe.ly/api/iframely',
});

export const fetchMetadata = (url) => api.get(`/?url=${encodeURI(url)}&api_key=${iframelyApiKey}`, config);
