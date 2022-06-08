import axios from 'axios';
import config from '../src/config';

const apollo = axios.create({
  baseURL: `http://localhost:${config.port}`,
  maxRedirects: 0,
  validateStatus(status) {
    return status >= 200 && status < 400;
  },
});

export default apollo;
