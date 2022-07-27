import nock from 'nock';
import { getRepoByUserIds } from '../repositories/repositoryService';
import { queue as importRepositoryQueue } from '../repoSync/importRepositoryQueue';
import { getOrganizationsByUser } from '../organizations/organizationService';
import apollo from '../../test/apolloClient';
import * as userService from './userService';
import { createAuthToken } from '../auth/authService';
import getClientAuth from '../../test/helpers/authHelper';
import { fixtures as githubFixtures } from '../../test/nocks/github';
import User from './userModel';

describe('GET /users/:id', () => {
  let user;
  let token;

  beforeAll(async () => {
    user = await userService.create({
      username: 'Ada',
      password: 's3cr3t',
      firstName: 'Ada',
      lastName: 'Lovelace',
      identities: [
        {
          email: 'ada@example.com',
          provider: 'github',
        },
      ],
      terms: true,
    });
  });

  describe('unauthenticated', () => {
    it('should return 401 Unauthorized', async () => {
      await expect(async () => {
        await apollo.get(`/v1/users/${user.id}`, {
          headers: {
            authorization: `Bearer 123`,
          },
        });
      }).rejects.toThrow(/401/);
    });
  });

  describe('authenticated', () => {
    beforeAll(async () => {
      token = await createAuthToken(user);
    });

    it('should return a user', async () => {
      const { status, data } = await apollo.get(`/v1/users/${user.id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(status).toBe(200);
      expect(data.user._id).toBe(user.id);
      expect(data.user.username).toBe('ada');
      expect(data.user.firstName).toBe('Ada');
      expect(data.user.lastName).toBe('Lovelace');
      expect(data.user.isActive).toBe(true);
      expect(data.user.isVerified).toBe(false);
      expect(data.user.isWaitlist).toBe(false);
      expect(data.user.avatarUrl).toBe('');
      expect(data.user.identities[0].provider).toBe('github');
      expect(data.user.identities[0].email).toBe('ada@example.com');
    });
  });
});

describe('POST /users', () => {
  let data;
  let user;

  beforeAll(async () => {
    // For now not testing Mailchimp and Intercom.
    nock('https://us6.api.mailchimp.com')
      .put(/./, () => true)
      .reply(200, {});

    nock('https://api.intercom.io')
      .post(/./, () => true)
      .reply(200, {});
  });

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
      .reply(200, githubFixtures.users.get('jrock17'))
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
          visibility: 'public',
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
          visibility: 'public',
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
          visibility: 'public',
          owner: {
            id: 80909084,
            login: 'SemaSandbox',
            type: 'Organization',
          },
        },
      ]);
  });

  const body = {
    user: {
      firstName: 'Justin',
      lastName: 'Ramers',
      username: 'jrock17@gmail.com',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1270524?v=4',
      isWaitlist: false,
      identities: [
        {
          provider: 'github',
          id: 1270524,
          username: 'jrock17',
          email: 'jrock17@gmail.com',
          firstName: 'Justin',
          lastName: 'Ramers',
          profileUrl: 'https://api.github.com/users/jrock17',
          avatarUrl: 'https://avatars.githubusercontent.com/u/1270524?v=4',
          emails: ['jrock17@gmail.com'],
          accessToken: 'ghu_ZJi3I2ZUaGvCXoKfo10WF3KsgdWhbH2g4uIg',
        },
      ],
    },
    invitation: [],
  };

  beforeAll(async () => {
    ({ data } = await apollo.post(`/v1/users`, body, {
      auth: await getClientAuth(),
    }));
  });

  it('should create a user', async () => {
    user = await User.findById(data.user._id);
    expect(user).toBeTruthy();
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

    it('should be marked as public', () => {
      const visibility = [...new Set(repositories.map((r) => r.visibility))];
      expect(visibility).toEqual(['public']);
    });
  });
});
