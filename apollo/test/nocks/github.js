import nock from 'nock';
import { addDays } from 'date-fns';
import fs from 'fs';
import path from 'path';
import glob from 'glob';

const fixtures = glob
  .sync(path.join(__dirname, '../fixtures/github/users/*.json'))
  .reduce((accum, filename) => {
    const payload = JSON.parse(fs.readFileSync(filename));
    accum.set(payload.login, payload);
    return accum;
  }, new Map());

export const rateLimitRemaining = new Map();

export default function github() {
  rateLimitRemaining.clear();

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
    })
    .get(/\/users\/.*/)
    .reply((pathname) => {
      const [, , username] = pathname.split('/');
      if (fixtures.has(username)) return [200, fixtures.get(username)];
      return [404, { message: `User ${username} not found` }];
    })
    .get('/rate_limit')
    .reply(function rateLimit() {
      const authorization = this.req.headers.authorization[0];
      const [, token] = authorization.split(' ');
      const remaining = rateLimitRemaining.has(token)
        ? rateLimitRemaining.get(token)
        : 1000;
      return [200, { resources: { core: { remaining } } }];
    });
}
