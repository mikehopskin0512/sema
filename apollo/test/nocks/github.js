import nock from 'nock';
import { addDays } from 'date-fns';
import fs from 'fs';
import path from 'path';
import glob from 'glob';

export const fixtures = {
  repos: glob
    .sync(path.join(__dirname, '../fixtures/github/repos/*.json'))
    .reduce((accum, filename) => {
      const payload = JSON.parse(fs.readFileSync(filename));
      accum.set(payload.id, payload);
      return accum;
    }, new Map()),

  users: glob
    .sync(path.join(__dirname, '../fixtures/github/users/*.json'))
    .reduce((accum, filename) => {
      const payload = JSON.parse(fs.readFileSync(filename));
      accum.set(payload.login, payload);
      return accum;
    }, new Map()),
};

export const rateLimitRemaining = new Map();

export default function github() {
  rateLimitRemaining.clear();

  nock('https://api.github.com')
    .persist()
    .get(/\/repos\/(\w+)\/(\w+)\/installation/)
    .reply((pathname) => {
      const owner = pathname.split('/')[2];
      if (owner === 'Semalab') return [200, { id: '25676597' }];
      return [404, {}];
    })
    .get('/app/installations')
    .query(() => true)
    .reply(200, [{ id: 25676597 }, { id: 45676599 }])
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
    .post('/app/installations/45676599/access_tokens', {})
    .reply(201, {
      token: 'ghs_4Z0VGC4uvSelTLk3bbumXa8IycJNAx3I0j3a',
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
    .get(/\/repositories\/.*/)
    .reply((pathname) => {
      const id = parseInt(pathname.split('/')[2], 10);
      if (fixtures.repos.has(id)) return [200, fixtures.repos.get(id)];
      console.log(`No fixture for ${pathname}`);
      return [404, { message: `Repo ${id} not found` }];
    })
    .get(/\/users\/.*/)
    .reply((pathname) => {
      const [, , username] = pathname.split('/');
      if (fixtures.users.has(username))
        return [200, fixtures.users.get(username)];
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
