import apollo from '../../test/apolloClient';
import { create as createRepository } from './repositoryService';
import { create as createSmartComment } from '../comments/smartComments/smartCommentService';
import { createAuthToken } from '../auth/authService';
import createUser from '../../test/helpers/userHelper';
import { queue as importRepositoryQueue } from '../repoSync/importRepositoryQueue';

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
        comment: 'LGTM',
        userId: user._id,
        location: 'files changed',
        githubMetadata: {
          repo_id: '123456',
          commentId: 'r690362133',
          url: 'https://github.com/Semalab/phoenix',
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
      expect(data.smartcomments.length).toBe(1);

      const [comment] = data.smartcomments;
      expect(comment.comment).toBe('LGTM');
    });
  });
});

describe('POST /repositories/:id/sync', () => {
  let user;
  let token;
  let repository;

  beforeAll(async () => {
    user = await createUser();
  });

  beforeAll(async () => {
    repository = await createRepository({
      name: 'phoenix',
      type: 'github',
      id: '234567',
    });
  });

  describe('unauthenticated', () => {
    it('should return 401 Unauthorized', async () => {
      await expect(async () => {
        await apollo.post(
          `/v1/repositories/${repository.id}/sync`,
          {},
          {
            headers: {
              authorization: 'Bearer 123',
            },
          }
        );
      }).rejects.toThrow(/401/);
    });
  });

  describe('authenticated', () => {
    let status;

    beforeAll(async () => {
      token = await createAuthToken(user);
    });

    beforeAll(async () => {
      ({ status } = await apollo.post(
        `/v1/repositories/${repository.id}/sync`,
        {},
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

    it('should queue the repository for sync', () => {
      expect(importRepositoryQueue.jobs[0]).toEqual({ id: repository.id });
    });
  });
});
