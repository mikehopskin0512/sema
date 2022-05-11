import glob from 'glob';
import path from 'path';
import Ironium from 'ironium';
import AWS from 'aws-sdk';
import { environment } from './config';
import logger from './shared/logger';

const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  Ironium.configure({
    credentials: AWS.RemoteCredentials,
    region: process.env.AWS_REGION || 'us-east-1',
  });
}

Ironium.onerror = logger.error;

async function loadQueues() {
  const srcRoot = __dirname;
  const files = glob.sync(`${srcRoot}/**/*Queue.js`);
  await Promise.all(files.map(loadQueueFile));
}

async function loadQueueFile(filename) {
  const queueName = getQueueNameFromFile(filename);
  const { default: handler } = await import(filename);
  Ironium.queue(queueName).eachJob(handler);
}

const queues = {
  self({ filename }) {
    const queueName = getQueueNameFromFile(filename);
    return Ironium.queue(queueName);
  },
};

export { loadQueues, queues };

function getQueueNameFromFile(filename) {
  const prefix = 'apollo';
  const suffix = path
    .basename(filename)
    .replace(/Queue\.js$/, '')
    .split(/(?=[A-Z])/)
    .join('-')
    .toLowerCase();
  const queueName = `${prefix}-${environment}-${suffix}`;
  return queueName;
}
