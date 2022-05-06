import apollo from '../../test/apolloClient';
import * as portfolioService from './portfolioService';
import { createAuthToken } from '../auth/authService';
import createUser from '../../test/helpers/userHelper';

describe('POST /portfolios', () => {
  let user;
  let token;

  beforeAll(async () => {
    user = await createUser();
  });

  describe('unauthenticated', () => {
    it('should return 401 Unauthorized', async () => {
      await expect(async () => {
        await apollo.post('/v1/portfolios', {
          headers: {
            authorization: 'Bearer 123',
          },
        });
      }).rejects.toThrow(/401/);
    });
  });

  describe('authenticated', () => {
    beforeAll(async () => {
      token = await createAuthToken(user);
    });

    it('should create a portfolio', async () => {
      const body = {
        userId: user.id,
        firstName: 'A.',
        lastName: 'L.',
        title: 'My Favorite Reviews',
        headline: 'A sample of my reviews',
        type: 'public',
        snapshots: [],
      };
      const { status, data } = await apollo.post('/v1/portfolios/', body, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(status).toBe(201);

      const portfolio = await portfolioService.getPortfolioById(data._id);
      expect(portfolio).not.toBeNull();

      expect(data.userId).toBe(user.id);
      expect(data.firstName).toBe('A.');
      expect(data.lastName).toBe('L.');
      expect(data.title).toBe('My Favorite Reviews');
      expect(data.headline).toBe('A sample of my reviews');
      expect(data.type).toBe('public');
    });
  });

  describe('creating for a different user', () => {
    // let anotherUser;

    beforeAll(async () => {
      await createUser({
        email: 'grace@example.com',
        firstName: 'Grace',
        lastName: 'Hopper',
      });
    });

    it.todo('should not create a portfolio');
    //   , async () => {
    //   const body = {
    //     userId: anotherUser.id,
    //     firstName: 'A.',
    //     lastName: 'L.',
    //     title: 'My Favorite Reviews',
    //     headline: 'A sample of my reviews',
    //     type: 'public',
    //     snapshots: [],
    //   };

    //   await expect(async () => {
    //     await apollo.post('/v1/portfolios/', body, {
    //       headers: {
    //         authorization: `Bearer ${token}`,
    //       },
    //     });
    //   }).rejects.toThrow(/401/);

    //   const portfolios = await portfolioService.getPortfoliosByUser(
    //     anotherUser.id
    //   );
    //   expect(portfolios.length).toBe(0);
    // });
  });
});
