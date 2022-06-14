import './env';
import mongoose from 'mongoose';
import Ironium from 'ironium';
import app from '../src/app';

jest.mock('../src/notifications/notificationService')

beforeAll(async () => {
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
}

expect.extend({
  // Matcher to compare MongoDB IDs and Mongoose documents.
  toEqualID(actual, expected) {
    // ObjectID#_id returns itself, so this is safe to call
    // on instances of both ObjectID and Mongoose document.
    const actualID = actual._id;
    const expectedID = expected._id;
    const pass = actualID.equals(expectedID);
    return {
      pass,
      message: () => `expected ${actualID} to match ${expectedID}`,
    };
  },
});
