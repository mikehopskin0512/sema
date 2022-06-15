import { connect } from 'getstream';
import { getstream } from '../config';

const client = connect(
  getstream.apiKey,
  getstream.apiKeySecret,
  getstream.appId
);

export default client;
