import apollo from '../../test/apolloClient';
import { createAuthToken } from '../auth/authService';
import createUser from '../../test/helpers/userHelper';

describe('GET /notification-token', () => {
  let user;
  let token;

  beforeAll(async () => {
    user = await createUser();
    token = await createAuthToken(user);
  });

  it('User should get a token for notifications', async () => {
    const { status, data } = await apollo.get('/v1/notifications/token', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(status).toBe(200);
    expect(data.notificationsToken).toBe(user._id.toString());
  });
});
