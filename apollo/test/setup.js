import './env';
import { differenceInMinutes } from 'date-fns';
import mongoose from 'mongoose';
import Ironium from 'ironium';
import nock from 'nock';
import app from '../src/app';
import resetNocks from './nocks';
import seed from './seed';

nock.disableNetConnect();
nock.enableNetConnect('localhost');

jest.mock('../src/notifications/notificationService');

beforeAll(async () => {
  resetNocks();
  await Promise.all([clearMongoDB(), Ironium.purgeQueues()]);
});

afterAll(async () => {
  // Close MongoDB and HTTP server for graceful shutdown.
  mongoose.connection.close();
  app.server.close();
});

async function clearMongoDB() {
  const collections = [...Object.values(mongoose.connection.collections)];
  await Promise.all(collections.map((collection) => collection.deleteMany()));
  await seed();
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
