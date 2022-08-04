import apollo from '../../test/apolloClient';
import { seed } from '../../test/seed';
import User from '../users/userModel';
import Organization from './organizationModel';
import { createAuthToken } from '../auth/authService';

describe('GET /:organizationId/metrics', () => {
  let data;
  let user;
  let token;
  let status;
  let organization;

  beforeAll(async () => {
    await seed();
  });

  beforeAll(async () => {
    organization = await Organization.findOne({ name: 'Semalab' });
    user = await User.findOne({ handle: 'codykenb' });
    token = await createAuthToken(user);
  });

  beforeAll(async () => {
    ({ status, data } = await apollo.get(
      `/v1/organizations/${organization._id}/metrics`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    ));
  });

  it('should respond with 200 OK', () => {
    expect(status).toBe(200);
  });

  it('should have total metrics', () => {
    expect(data.totalMetrics).toEqual({
      smartCodeReviews: 1,
      smartComments: 1,
      smartCommenters: 1,
      semaUsers: 1,
    });
  });
});
