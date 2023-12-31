import glob from 'glob';
import path from 'path';
import Ironium from 'ironium';
import AWS from 'aws-sdk';
import mongoose from 'mongoose';
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
    canScheduleJob,
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
  const queueFiles = glob.sync(`${srcRoot}/**/*Queue.js`);
  await Promise.all(queueFiles.map(loadQueueFile));
  const scheduleFiles = glob.sync(`${srcRoot}/**/*Schedule.js`);
  await Promise.all(scheduleFiles.map(loadScheduleFile));
}

async function loadQueueFile(filename) {
  const queueName = getQueueNameFromFile(filename);
  const { default: handler } = await import(filename);
  Ironium.queue(queueName).eachJob(handler);
  logger.info(
    `Registered ${path.relative(__dirname, filename)} to handle ${queueName}`
  );
}

async function loadScheduleFile(filename) {
  const scheduleName = getQueueNameFromFile(filename);
  const { default: handler, schedule } = await import(filename);
  Ironium.scheduleJob(scheduleName, schedule, handler);
  logger.info(
    `Registered ${path.relative(__dirname, filename)} to handle ${scheduleName}`
  );
}

const queues = {
  self({ filename }) {
    const queueName = getQueueNameFromFile(filename);
    const queue = Ironium.queue(queueName);
    if (isTest) {
      // Allow inspecting jobs in tests.
      // This soon to be included in Ironium directly.
      queue.jobs = [];
      const originalQueueJob = queue.queueJob.bind(queue);
      queue.queueJob = async (payload) => {
        queue.jobs.push(payload);
        await originalQueueJob(payload);
      };
      const originalPurgeQueue = queue.purgeQueue.bind(queue);
      queue.purgeQueue = async () => {
        await originalPurgeQueue();
        queue.jobs.splice(0);
      };
    }
    return queue;
  },
};

export { loadQueues, queues };

function getQueueNameFromFile(filename) {
  const prefix = 'apollo';
  const suffix = path
    .basename(filename)
    .replace(/(Queue|Schedule)\.js$/, '')
    .split(/(?=[A-Z])/)
    .join('-')
    .toLowerCase();
  const queueName = `${prefix}-${environment}-${suffix}`;
  return queueName;
}

let ironiumCollectionPromise;

// Coordinate Ironium workers to prevent duplicate scheduled jobs.
async function canScheduleJob(jobName, timestamp) {
  if (!ironiumCollectionPromise) {
    ironiumCollectionPromise = getIroniumCollection();
  }
  const collection = await ironiumCollectionPromise;
  try {
    const { insertedCount } = await collection.insertOne({
      jobName,
      timestamp: new Date(timestamp),
    });
    const acquiredLock = insertedCount === 1;
    return acquiredLock;
  } catch (error) {
    if (error.code === 11000) {
      return false;
    }
    throw error;
  }
}

async function getIroniumCollection() {
  const collection = mongoose.connection.collection('ironium');
  await Promise.all([
    collection.createIndex({ jobName: 1 }, { unique: true }),
    collection.createIndex({ timestamp: 1 }, { expireAfterSeconds: 59 }),
  ]);
  return collection;
}
