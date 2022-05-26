import glob from 'glob';
import path from 'path';
import Ironium from 'ironium';
import AWS from 'aws-sdk';
import { environment } from './config';
import logger from './shared/logger';

import './shared/mongo';

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

if (isProduction) {
  const region = process.env.AWS_REGION || 'us-east-1';
  logger.info(
    `Configuring Ironium via ECS remote credentials, region is ${region}`
  );
  Ironium.configure({
    credentials: new AWS.RemoteCredentials(),
    region,
  });
}

if (isTest) {
  // Isolate queues in tests.
  const jestWorkerID = parseInt(process.env.JEST_WORKER_ID || 0, 10);
  Ironium.configure({ prefix: `test-${jestWorkerID}-` });
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
  logger.info(`Registered ${filename} to handle ${queueName}`);
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
