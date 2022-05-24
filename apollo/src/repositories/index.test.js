import apollo from '../../test/apolloClient';
import { create as createRepository } from './repositoryService';
import { create as createSmartComment } from '../comments/smartComments/smartCommentService';
import { createAuthToken } from '../auth/authService';
import createUser from '../../test/helpers/userHelper';

describe('GET /repositories/overview', () => {
  let user;
  let token;

  beforeAll(async () => {
    user = await createUser();
  });

  describe('unauthenticated', () => {
    it('should return 401 Unauthorized', async () => {
      await expect(async () => {
        await apollo.get('/v1/repositories/overview', {
          params: { externalId: '123456' },
          headers: {
            authorization: 'Bearer 123',
          },
        });
      }).rejects.toThrow(/401/);
    });
  });

  describe('authenticated', () => {
    let data;

    beforeAll(async () => {
      token = await createAuthToken(user);
    });

    beforeAll(async () => {
      await createRepository({
        name: 'phoenix',
        type: 'github',
        id: '123456',
      });

      await createSmartComment({
        comment: 'The later comment',
        userId: user._id,
        location: 'files changed',
        githubMetadata: {
          repo_id: '123456',
          commentId: 'r690362133',
          url: 'https://github.com/Semalab/phoenix',
          created_at: '2020-12-18T20:30:00Z',
        },
      });

      await createSmartComment({
        comment: 'The earlier comment',
        userId: user._id,
        location: 'files changed',
        githubMetadata: {
          repo_id: '123456',
          commentId: 'r730362118',
          url: 'https://github.com/Semalab/phoenix',
          created_at: '2020-12-17T20:30:00Z',
        },
      });
    });

    beforeAll(async () => {
      ({ data } = await apollo.get('/v1/repositories/overview', {
        params: { externalId: '123456' },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }));
    });

    it.todo('should respond with 200 OK');

    it('should include smart comments', () => {
      expect(data.smartcomments.length).toBe(2);
      expect(data.smartcomments[0].comment).toBe('The later comment');
      expect(data.smartcomments[1].comment).toBe('The earlier comment');
    });
  });
});
