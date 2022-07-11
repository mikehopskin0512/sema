import nock from 'nock';
import { decode } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import apollo from '../../../test/apolloClient';
import User from '../../users/userModel';
import Organization from '../../organizations/organizationModel';
import { createGhostUser } from '../../users/userService';
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
      .query({ per_page: 100, page: 1 })
      .reply(200, [
        {
          owner: {
            id: '3456',
            login: 'jrock17',
            type: 'User',
          },
        },
        {
          owner: {
            id: '1234',
            login: 'Semalab',
            type: 'Organization',
          },
        },
        {
          owner: {
            id: '2345',
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
      const jwt = decode(cookies.get('_phoenix'));
      expect(jwt._id).toEqualID(user._id);
    });

    it('should sync organizations', async () => {
      const organizations = await Organization.find({});
      const organizationLogins = organizations.map((o) => o.name).sort();
      expect(organizationLogins).toEqual(['SemaSandbox', 'Semalab']);
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
      const jwt = decode(cookies.get('_phoenix'));
      expect(jwt._id).toEqualID(user._id);
    });
  });
});

function getCookies(headers) {
  return new Map(headers.map((header) => header.split(';')[0].split('=', 2)));
}
