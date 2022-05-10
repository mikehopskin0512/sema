import apollo from '../../test/apolloClient';
import * as userService from './userService';
import { createAuthToken } from '../auth/authService';

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
