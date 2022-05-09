import axios from 'axios';
import config from '../src/config';

const apollo = axios.create({
  baseURL: `http://localhost:${config.port}`,
});

export default apollo;
