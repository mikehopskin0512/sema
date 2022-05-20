import axios from 'axios';
import http from 'http';
import https from 'https';
import { jaxon } from '../config';

const tagsEndpoint = `${jaxon.tagsApi}/tags`;
const summariesEndpoint = `${jaxon.summariesApi}/summaries`;

const client = axios.create({
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
});

export async function getTags(text) {
  const data = await getTagsRaw(text);
  return data.hard_labels.flat();
}

export async function getTagsRaw(text) {
  const body = { comments: text };
  const { data } = await client.post(tagsEndpoint, body);
  return data;
}

export async function getSummaries(text) {
  const data = await getSummariesRaw(text);
  return data.hard_labels.flat();
}

export async function getSummariesRaw(text) {
  const body = { comments: text };
  const { data } = await client.post(summariesEndpoint, body);
  return data;
}
