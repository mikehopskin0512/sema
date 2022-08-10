import './env';
import { differenceInMinutes } from 'date-fns';
import mongoose from 'mongoose';
import Ironium from 'ironium';
import nock from 'nock';
import timekeeper from 'timekeeper';
import app from '../src/app';
import resetNocks from './nocks';
import { loadQueues } from '../src/queues';
import { baseSeed } from './seed';

nock.disableNetConnect();
nock.enableNetConnect('localhost');

jest.mock('../src/notifications/notificationService');

const loadQueuesPromise = loadQueues();

beforeAll(async () => {
  timekeeper.travel(new Date('2022-06-01T01:15:00.000Z'));
  await loadQueuesPromise;
  resetNocks();
  await Promise.all([clearMongoDB(), Ironium.purgeQueues()]);
});

afterAll(async () => {
  // Close MongoDB and HTTP server for graceful shutdown.
  mongoose.connection.close();
  app.server.close();
});

// Makes Jest watch mode more reliable by shutting
// down the server when process halts.
process.on('exit', () => {
  try {
    mongoose.connection.close();
    app.server.close();
  } catch (error) {
    // Ignore these errors.
  }
});

async function clearMongoDB() {
  const collections = [...Object.values(mongoose.connection.collections)];
  await Promise.all(collections.map((collection) => collection.deleteMany()));
  await baseSeed();
}

expect.extend({
  // Matcher to compare MongoDB IDs and Mongoose documents.
  toEqualID(actual, expected) {
    // ObjectID#_id returns itself, so this is safe to call
    // on instances of both ObjectID and Mongoose document.
    const actualID = actual?._id || actual;
    const expectedID = expected?._id || expected;
    const pass = !!(
      actualID &&
      expectedID &&
      actualID.toString() === expectedID.toString()
    );
    return {
      pass,
      message: () => `expected ${actualID} to match ${expectedID}`,
    };
  },

  toBeCloseToDate(actual, expected) {
    const diff = differenceInMinutes(actual, expected);
    const pass = diff === 0;
    return {
      pass,
      message: () =>
        `expected ${actual} to be within one minute of ${expected}`,
    };
  },
});
