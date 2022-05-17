import './env';
import mongoose from 'mongoose';
import Ironium from 'ironium';
import nock from 'nock';
import { addDays } from 'date-fns';
import app from '../src/app';

nock.disableNetConnect();
nock.enableNetConnect('localhost');

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

nock('https://api.github.com')
  .persist()
  .post('/app/installations/25676597/access_tokens', {})
  .reply(201, {
    token: 'ghs_3X0VGC4uvSelTLk3bbumXa8IycJNAx3I0j2z',
    expires_at: addDays(new Date(), 1).toISOString(),
    permissions: {
      members: 'read',
      organization_administration: 'read',
      organization_projects: 'read',
      actions: 'read',
      administration: 'read',
      contents: 'read',
      discussions: 'write',
      issues: 'write',
      metadata: 'read',
      pull_requests: 'write',
      repository_hooks: 'write',
      repository_projects: 'read',
      vulnerability_alerts: 'read',
    },
    repository_selection: 'selected',
  });
