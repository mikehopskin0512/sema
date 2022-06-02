import apollo from '../../test/apolloClient';
import * as userService from '../users/userService';
import { createAuthToken } from '../auth/authService';

describe('GET /notification-token', () => {
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
          provider: 'github'
        }
      ],
      terms: true
    });
    token = await createAuthToken(user);
  });

  it('User should get a token for notifications', async () => {
    const { status, data } = await apollo.get('/v1/notification-token', {
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    expect(status).toBe(200);
    expect(data.notificationsToken).toBe('ada');
  });
});
