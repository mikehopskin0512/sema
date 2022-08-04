import apollo from '../../test/apolloClient';
import { seed } from '../../test/seed';
import { create as createRepository } from './repositoryService';
import Repository from './repositoryModel';
import User from '../users/userModel';
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
          params: { externalId: '237888452' },
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
        id: '237888452',
      });

      await createSmartComment({
        comment: 'The later comment',
        userId: user._id,
        location: 'files changed',
        githubMetadata: {
          repo_id: '237888452',
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
          repo_id: '237888452',
          commentId: 'r730362118',
          url: 'https://github.com/Semalab/phoenix',
          created_at: '2020-12-17T20:30:00Z',
        },
      });
    });

    beforeAll(async () => {
      ({ data } = await apollo.get('/v1/repositories/overview', {
        params: { externalId: '237888452' },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }));
    });

    it.todo('should respond with 200 OK');

    it('should have visibility', () => {
      expect(data.visibility).toBe('private');
    });

    it('should include smart comments', () => {
      expect(data.smartcomments.length).toBe(2);
      expect(data.smartcomments[0].comment).toBe('The later comment');
      expect(data.smartcomments[1].comment).toBe('The earlier comment');
    });
  });

  describe('partially-synced repository', () => {
    let data;

    beforeAll(async () => {
      token = await createAuthToken(user);
    });

    beforeAll(async () => {
      const repository = await Repository.findOne({ externalId: '237888452' });
      repository.sync = {
        progress: {
          pullRequestComment: {
            currentPage: 1,
            lastPage: 1,
          },
          pullRequestReview: {
            currentPage: 2,
            lastPage: 3,
          },
          issueComment: {
            currentPage: 1,
            lastPage: 7,
          },
        },
      };
      await repository.save();
    });

    beforeAll(async () => {
      ({ data } = await apollo.get('/v1/repositories/overview', {
        params: { externalId: '237888452' },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }));
    });

    it.todo('should respond with 200 OK');

    it('should include progress', () => {
      expect(data.sync.progress.overall).toBe('0.36');
    });
  });

  describe('repository with no sync', () => {
    let data;

    beforeAll(async () => {
      token = await createAuthToken(user);
    });

    beforeAll(async () => {
      const repository = await Repository.findOne({ externalId: '237888452' });
      await repository.updateOne({ sync: null });
    });

    beforeAll(async () => {
      ({ data } = await apollo.get('/v1/repositories/overview', {
        params: { externalId: '237888452' },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }));
    });

    it.todo('should respond with 200 OK');

    it('should not have sync attribute', () => {
      expect(data.sync).toBeFalsy();
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
      name: 'astrobee',
      type: 'github',
      id: '391620249',
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

describe('GET /repositories/filter-values', () => {
  let user;
  let data;
  let status;
  let token;

  beforeAll(async () => {
    await User.deleteMany();
    await Repository.deleteMany();
    await seed();
    user = await User.findOne();
    token = await createAuthToken(user);
  });

  beforeAll(async () => {
    ({ status, data } = await apollo.get('/v1/repositories/filter-values', {
      params: {
        externalIds: JSON.stringify(['237888452', '391620249']),
        filterFields: JSON.stringify({
          authors: 1,
          requesters: 1,
          pullRequests: true,
        }),
      },
      headers: {
        authorization: `Bearer ${token}`,
      },
    }));
  });

  it('should respond with 200 OK', () => {
    expect(status).toBe(200);
  });

  it('should have authors', () => {
    expect(data.filter.authors).toEqual([
      {
        label: 'Brendan Cody-Kenny',
        value: '61041e153e90570022942e58',
        img: 'https://avatars.githubusercontent.com/u/6106595?v=4',
      },
      {
        label: 'Matt Van Itallie',
        value: '60b20ec1ad927f001e3f4f7e',
        img: 'https://avatars.githubusercontent.com/u/31629621?v=4',
      },
    ]);
  });

  it('should have requesters', () => {
    expect(data.filter.requesters).toEqual([
      {
        label: 'Andrew-B3901',
        value: 'Andrew-B3901',
        img: '/img/default-avatar.jpg',
      },
      {
        label: 'ArtsemMaliutsin',
        value: 'ArtsemMaliutsin',
        img: '/img/default-avatar.jpg',
      },
    ]);
  });

  it('should have pull requests', () => {
    expect(data.filter.pullRequests).toEqual([
      {
        updated_at: '2022-05-05T16:03:46.000Z',
        label: 'Pull Request (#1665)',
        value: '1665',
        name: 'Pull Request',
      },
      {
        updated_at: '2022-05-03T19:34:22.000Z',
        label: 'Pull Request (#3)',
        value: '3',
        name: 'Pull Request',
      },
    ]);
  });
});
