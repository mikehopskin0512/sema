import assert from 'assert';
import apollo from '../../test/apolloClient';
import * as userService from '../users/userService';
import Repository from '../repositories/repositoryModel';
import { createAuthToken } from '../auth/authService';

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
    beforeAll(async () => {
      token = await createAuthToken(user);
    });

    beforeAll(async () => {
      // This is an assertion on the state of the database
      // before running the test, thus not using expect().
      const count = await Repository.countDocuments();
      assert(count === 0);
    });

    it('should add a repository for sync', async () => {
      const { status, data } = await apollo.post(
        '/v1/repo-sync/',
        {
          type: 'github',
          externalId: '123456',
          installationId: '9876543',
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      expect(status).toBe(200);
      const repository = await Repository.findOne();

      expect(data._id).toBe(repository._id.toString());
      expect(repository.type).toBe('github');
      expect(repository.externalId).toBe('123456');
      expect(repository.installationId).toBe('9876543');
      expect(repository.sync.status).toBe('pending');
      expect(repository.sync.addedBy).toEqualID(user);
    });
  });
});
