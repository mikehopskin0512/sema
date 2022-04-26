import './env';
import mongoose from 'mongoose';
import app from '../src/app';

beforeAll(async () => {
  await clearMongoDB();
});

afterAll(async () => {
  // Close MongoDB and HTTP server for graceful shutdown.
  mongoose.connection.close();
  app._server.close();
});

async function clearMongoDB() {
  const collections = [...Object.values(mongoose.connection.collections)];
  await Promise.all(collections.map((collection) => collection.deleteMany()));
}
