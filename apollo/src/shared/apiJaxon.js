import axios from 'axios';
import axiosRetry from 'axios-retry';
import axiosThrottle from 'axios-request-throttle';
import http from 'http';
import https from 'https';
import { jaxon } from '../config';

const tagsEndpoint = `${jaxon.tagsApi}/tags`;
const summariesEndpoint = `${jaxon.summariesApi}/summaries`;

const client = axios.create({
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
});

// Don't overwhelm Jaxon, except in tests.
if (process.env.NODE_ENV !== 'test')
  axiosThrottle.use(client, { requestsPerSecond: 100 });

axiosRetry(client, { retries: 2, retryDelay: axiosRetry.exponentialDelay });

export async function getTags(text) {
  const data = await getTagsRaw(text);
  return data.hard_labels.flat();
}

export async function getTagsRaw(text) {
  const body = { comments: text };

  try {
    const { data } = await client.post(tagsEndpoint, body);
    return data;
  } catch (error) {
    if (error.isAxiosError) {
      const customError = new Error(
        `Error querying Jaxon tags ${error.response?.status ?? error.code}`
      );
      customError.body = body;
      throw customError;
    } else throw error;
  }
}

export async function getSummaries(text) {
  const data = await getSummariesRaw(text);
  return data.hard_labels.flat();
}

export async function getSummariesRaw(text) {
  const body = { comments: text };

  try {
    const { data } = await client.post(summariesEndpoint, body);
    return data;
  } catch (error) {
    if (error.isAxiosError) {
      const customError = new Error(
        `Error querying Jaxon summaries ${error.response?.status ?? error.code}`
      );
      customError.body = body;
      throw customError;
    } else throw error;
  }
}
