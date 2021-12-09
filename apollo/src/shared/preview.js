import axios from 'axios';

import { iframelyApiKey } from '../config';
import logger from '../shared/logger';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const api = axios.create({
  baseURL: 'https://iframe.ly/api/iframely',
});

export const fetchMetadata = (url) => {
  if (iframelyApiKey) {
    return api.get(`/?url=${encodeURI(url)}&api_key=${iframelyApiKey}`, config);
  } else {
    logger.error('No Iframely API token present');
  }
}
