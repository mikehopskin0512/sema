import nock from 'nock';
import { decode } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import apollo from '../../../test/apolloClient';
import User from '../../users/userModel';
import { createGhostUser } from '../../users/userService';
import { getRepoByUserIds } from '../../repositories/repositoryService';
import { queue as importRepositoryQueue } from '../../repoSync/importRepositoryQueue';
import { getOrganizationsByUser } from '../../organizations/organizationService';
import createUser from '../../../test/helpers/userHelper';

const justin = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../../test/fixtures/github/users/jrock17.json')
  )
);

describe('GET /identities/github/cb', () => {
  let status;
  let headers;
  let redirectUrl;

  beforeAll(() => {
    nock('https://github.com')
      .persist()
      .post('/login/oauth/access_token', {
        client_id: 'Iv1.5fc0e813e59b2277',
        client_secret: '0cb124f5a840af2218de1f75300e4f56ae6485cc',
        code: '629e18f54c8605',
      })
      .reply(200, {
        access_token: 'gho_16C7e42F292c6912E7710c838347Ae178B4a',
        scope: '',
        token_type: 'bearer',
      });

    nock('https://api.github.com')
      .persist()
      .get('/user')
      .reply(200, justin)
      .get('/user/emails')
      .reply(200, [
        {
          email: 'jrock17@example.com',
          verified: true,
          primary: true,
          visibility: 'public',
        },
      ])
      .get('/user/repos')
      .query({
        per_page: 100,
        sort: 'pushed',
        visibility: 'public',
        affiliation: 'owner,collaborator',
      })
      .reply(200, [
        {
          id: 175071530,
          name: 'reactivesearch',
          clone_url: 'https://github.com/jrock17/reactivesearch.git',
          owner: {
            id: 1270524,
            login: 'jrock17',
            type: 'User',
          },
        },
        {
          id: 237888452,
          name: 'phoenix',
          clone_url: 'https://github.com/Semalab/phoenix.git',
          owner: {
            id: 31629704,
            login: 'Semalab',
            type: 'Organization',
          },
        },
        {
          id: 391620249,
          name: 'astrobee',
          clone_url: 'https://github.com/SemaSandbox/astrobee.git',
          owner: {
            id: 80909084,
            login: 'SemaSandbox',
            type: 'Organization',
          },
        },
      ]);
  });

  describe('new user signup', () => {
    beforeAll(async () => {
      ({ status, headers } = await apollo.get(
        '/v1/identities/github/cb?code=629e18f54c8605'
      ));
      redirectUrl = new URL(headers.location);
    });

    it('should redirect to registration', () => {
      expect(status).toBe(302);
      expect(redirectUrl.pathname).toBe('/register');
    });

    it('should include the identity token in the query string', () => {
      const jwt = decode(redirectUrl.searchParams.get('token'));
      expect(jwt.identity.provider).toBe('github');
      expect(jwt.identity.id).toBe(1270524);
    });

    it('should not create a user in the database', async () => {
      const count = await User.countDocuments();
      expect(count).toBe(0);
    });
  });

  describe('existing user on waitlist', () => {
    let user;

    beforeAll(async () => {
      // Just entroy
      await createUser({
        handle: 'pangeaware',
        identities: [
          {
            provider: 'github',
            username: 'pangeaware',
            id: 1045023,
          },
        ],
        isWaitlist: true,
      });
    });

    beforeAll(async () => {
      user = await createUser({
        handle: 'jrock17',
        identities: [
          {
            provider: 'github',
            username: 'jrock17',
            id: 1270524,
          },
        ],
        isWaitlist: true,
      });
    });

    beforeAll(async () => {
      ({ status, headers } = await apollo.get(
        '/v1/identities/github/cb?code=629e18f54c8605'
      ));
      redirectUrl = new URL(headers.location);
    });

    it('should redirect to registration', () => {
      expect(status).toBe(302);
      expect(redirectUrl.pathname).toBe('/register');
    });

    it('should include the GitHub identity token in the query string', () => {
      const jwt = decode(redirectUrl.searchParams.get('token'));
      expect(jwt.identity.provider).toBe('github');
      expect(jwt.identity.id).toBe(1270524);
    });

    it('should set the refresh token in a cookie', () => {
      const cookies = getCookies(headers['set-cookie']);
      const jwt = decode(cookies.get('_sema'));
      expect(jwt._id).toEqualID(user._id);
    });

    it('should sync organizations', async () => {
      const organizations = await getOrganizationsByUser(user._id);
      const organizationLogins = organizations
        .map((o) => o.organization.name)
        .sort();
      expect(organizationLogins).toEqual(['SemaSandbox', 'Semalab']);
    });

    describe('repositories', () => {
      let repositories;

      beforeAll(async () => {
        repositories = await getRepoByUserIds([user._id]);
        user = await User.findById(user._id);
      });

      it('should exist in the database', () => {
        const names = repositories.map((r) => r.fullName).sort();
        expect(names).toEqual([
          'SemaSandbox/astrobee',
          'Semalab/phoenix',
          'jrock17/reactivesearch',
        ]);
      });

      it('should be queued for sync', () => {
        const jobs = importRepositoryQueue.jobs.map((job) => job.id).sort();
        expect(jobs).toEqual(repositories.map((r) => r.id).sort());
      });

      it('should be added to the identity', () => {
        const ids = user.identities[0].repositories.map((r) => r.id).sort();
        expect([...ids]).toEqual(['175071530', '237888452', '391620249']);
      });
    });

    describe('log in again', () => {
      beforeAll(async () => {
        await importRepositoryQueue.purgeQueue();
      });

      beforeAll(async () => {
        ({ status, headers } = await apollo.get(
          '/v1/identities/github/cb?code=629e18f54c8605'
        ));
      });

      describe('repositories', () => {
        it('should not be queued for sync', () => {
          expect(importRepositoryQueue.jobs).toHaveLength(0);
        });
      });
    });
  });

  describe('existing user not on waitlist', () => {
    beforeAll(async () => {
      await User.deleteMany();
    });

    beforeAll(async () => {
      await createUser({
        handle: 'jrock17',
        identities: [
          {
            provider: 'github',
            username: 'jrock17',
            id: 1270524,
          },
        ],
        isWaitlist: false,
      });
    });

    beforeAll(async () => {
      ({ status, headers } = await apollo.get(
        '/v1/identities/github/cb?code=629e18f54c8605'
      ));
      redirectUrl = new URL(headers.location);
    });

    it('should redirect to dashboard', () => {
      expect(status).toBe(302);
      expect(redirectUrl.pathname).toBe('/dashboard');
    });
  });

  describe('existing ghost user (from sync)', () => {
    let user;

    beforeAll(async () => {
      await User.deleteMany();
    });

    beforeAll(async () => {
      user = await createGhostUser({
        handle: 'jrock17',
        identities: [
          {
            provider: 'github',
            username: 'jrock17',
            id: 1270524,
          },
        ],
      });
    });

    beforeAll(async () => {
      ({ status, headers } = await apollo.get(
        '/v1/identities/github/cb?code=629e18f54c8605'
      ));
      redirectUrl = new URL(headers.location);
    });

    it('should redirect to registration', () => {
      expect(status).toBe(302);
      expect(redirectUrl.pathname).toBe('/register');
    });

    it('should include the identity token in the query string', () => {
      const jwt = decode(redirectUrl.searchParams.get('token'));
      expect(jwt.identity.provider).toBe('github');
      expect(jwt.identity.id).toBe(1270524);
    });

    it('should set the refresh token in a cookie', () => {
      const cookies = getCookies(headers['set-cookie']);
      const jwt = decode(cookies.get('_sema'));
      expect(jwt._id).toEqualID(user._id);
    });
  });
});

function getCookies(headers) {
  return new Map(headers.map((header) => header.split(';')[0].split('=', 2)));
}
