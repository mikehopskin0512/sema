import { create as createRepository } from '../repositories/repositoryService';
import apollo from '../../test/apolloClient';
import * as userService from '../users/userService';
import Repository from '../repositories/repositoryModel';
import { createAuthToken } from '../auth/authService';
import { queue as importRepositoryQueue } from './importRepositoryQueue';

describe('POST /repo-sync', () => {
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
        await apollo.post(
          `/v1/repo-sync/`,
          {},
          {
            headers: {
              authorization: `Bearer 123`,
            },
          }
        );
      }).rejects.toThrow(/401/);
    });
  });

  describe('authenticated', () => {
    let status;
    let data;
    let repository;

    beforeAll(async () => {
      token = await createAuthToken(user);
    });

    beforeAll(async () => {
      await createRepository({
        name: 'phoenix',
        type: 'github',
        id: '237888452',
        cloneUrl: 'https://github.com/Semalab/phoenix',
      });
    });

    beforeAll(async () => {
      ({ status, data } = await apollo.post(
        '/v1/repo-sync/',
        {
          type: 'github',
          externalId: '237888452',
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      ));

      repository = await Repository.findOne();
    });

    it('should respond with 200 OK', () => {
      expect(status).toBe(200);
    });

    it('should add a repository for sync', async () => {
      expect(data._id).toBe(repository._id.toString());
      expect(repository.type).toBe('github');
      expect(repository.externalId).toBe('237888452');
      expect(repository.sync.status).toBe('queued');
      expect(repository.sync.queuedAt).toBeCloseToDate(new Date());
      expect(repository.sync.addedBy).toEqualID(user);
    });

    it('should queue a job to start the sync', () => {
      expect(importRepositoryQueue.jobs).toHaveLength(1);
      expect(importRepositoryQueue.jobs[0]).toEqual({ id: repository.id });
    });

    describe('adding the same repo again', () => {
      beforeAll(async () => {
        ({ status, data } = await apollo.post(
          '/v1/repo-sync/',
          {
            type: 'github',
            externalId: '237888452',
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        ));

        repository = await Repository.findOne();
      });

      it('should not create another repository', async () => {
        const count = await Repository.countDocuments({
          externalId: repository.externalId,
        });
        expect(count).toBe(1);
      });

      it('should queue a job to start the sync', () => {
        expect(importRepositoryQueue.jobs).toHaveLength(2);
        expect(importRepositoryQueue.jobs[1]).toEqual({ id: repository.id });
      });
    });

    describe('existing repository without sync set up', () => {
      beforeAll(async () => {
        repository.sync = {};
        await repository.save();
        await importRepositoryQueue.purgeQueue();
      });

      beforeAll(async () => {
        ({ status, data } = await apollo.post(
          '/v1/repo-sync/',
          {
            type: 'github',
            externalId: '237888452',
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        ));

        repository = await Repository.findOne();
      });

      it('should respond with 200 OK', () => {
        expect(status).toBe(200);
      });

      it('should add a repository for sync', async () => {
        expect(data._id).toBe(repository._id.toString());
        expect(repository.type).toBe('github');
        expect(repository.externalId).toBe('237888452');
        expect(repository.sync.status).toBe('queued');
        expect(repository.sync.queuedAt).toBeCloseToDate(new Date());
        expect(repository.sync.addedBy).toEqualID(user);
      });

      it('should queue a job to start the sync', () => {
        expect(importRepositoryQueue.jobs).toHaveLength(1);
        expect(importRepositoryQueue.jobs[0]).toEqual({ id: repository.id });
      });
    });
  });
});
