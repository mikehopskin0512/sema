import assert from 'assert';
import apollo from '../../../test/apolloClient';
import { createAuthToken } from '../../auth/authService';
import createUser from '../../../test/helpers/userHelper';
import SmartComment from './smartCommentModel';
import Repository from '../../repositories/repositoryModel';

describe('GET /comments/smart/overview', () => {
  let user;
  let token;

  beforeAll(async () => {
    user = await createUser();
  });

  describe('unauthenticated', () => {
    it('should return 401 Unauthorized', async () => {
      await expect(async () => {
        await apollo.get('/v1/comments/smart/overview', {
          headers: {
            authorization: 'Bearer 123',
          },
        });
      }).rejects.toThrow(/401/);
    });
  });

  describe('with two comments', () => {
    let data;

    beforeAll(async () => {
      token = await createAuthToken(user);
    });

    beforeAll(async () => {
      const laterComment = await SmartComment.create({
        userId: user,
        comment: 'The later comment',
        location: 'conversation',
        suggestedComments: [],
        tags: [],
        githubMetadata: {
          commentId: 'issuecomment-14049223',
          filename: null,
          repo: 'phoenix',
          repo_id: '237888452',
          url: 'https://github.com/Semalab/phoenix',
          created_at: '2020-12-18T20:30:00Z',
          updated_at: '2020-12-17T20:30:14Z',
          user: {
            id: '1270524',
            login: 'jrock17',
          },
          requester: 'codykenb',
        },
      });
      const earlierComment = await SmartComment.create({
        userId: user,
        comment: 'The earlier comment',
        location: 'conversation',
        suggestedComments: [],
        tags: [],
        githubMetadata: {
          commentId: 'issuecomment-23049209',
          filename: null,
          repo: 'phoenix',
          repo_id: '237888452',
          url: 'https://github.com/Semalab/phoenix',
          created_at: '2020-12-17T18:30:00Z',
          updated_at: '2020-12-17T20:30:14Z',
          user: {
            id: '1270524',
            login: 'jrock17',
          },
          requester: 'codykenb',
        },
        source: {
          provider: 'github',
          origin: 'sync',
        },
      });

      // Ensure the earlier comment was created last in the database.
      assert(earlierComment._id.toString() > laterComment._id.toString());
      assert(earlierComment.createdAt > laterComment.createdAt);
      assert(earlierComment.source.createdAt < laterComment.source.createdAt);

      ({ data } = await apollo.get('/v1/comments/smart/overview', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }));
    });

    it.todo('should respond with 200 OK');

    describe('list of comments', () => {
      it('should be sorted by creation date at the source, descending', () => {
        expect(data.overview.smartComments[0].comment).toBe(
          'The later comment'
        );
        expect(data.overview.smartComments[1].comment).toBe(
          'The earlier comment'
        );
      });
    });
  });
});

describe('POST /comments/smart', () => {
  let user;
  let token;

  beforeAll(async () => {
    await SmartComment.deleteMany();
    user = await createUser();
  });

  describe('unauthenticated', () => {
    it('should return 401 Unauthorized', async () => {
      await expect(async () => {
        await apollo.post(
          '/v1/comments/smart',
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

  describe('from issue comment (conversation)', () => {
    let status;

    beforeAll(async () => {
      token = await createAuthToken(user);
    });

    beforeAll(async () => {
      const body = {
        comment: 'LGTM',
        userId: user.id,
        location: 'conversation',
        suggestedComments: [],
        tags: [],
        githubMetadata: {
          commentId: 'issuecomment-23049209',
          filename: null,
          repo: 'phoenix',
          repo_id: '237888452',
          url: 'https://github.com/Semalab/phoenix',
          created_at: '2020-12-17T18:41:44Z',
          updated_at: '2020-12-17T20:30:14Z',
          user: {
            id: '1270524',
            login: 'jrock17',
          },
          requester: 'codykenb',
        },
      };

      ({ status } = await apollo.post('/v1/comments/smart', body, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }));
    });

    it('should respond with 201 Created', async () => {
      expect(status).toBe(201);
    });

    describe('smart comment document', () => {
      let comment;

      beforeAll(async () => {
        comment = await SmartComment.findOne();
      });

      it('should have source provider', () => {
        expect(comment.source.provider).toBe('github');
      });

      it('should have source ID', () => {
        expect(comment.source.id).toBe('issueComment:23049209');
      });

      it('should have source origin', () => {
        expect(comment.source.origin).toBe('extension');
      });

      it('should have GitHub metadata ID', () => {
        expect(comment.githubMetadata.id).toBe('23049209');
      });

      it('should have GitHub metadata type', () => {
        expect(comment.githubMetadata.type).toBe('issueComment');
      });
    });

    describe('repository', () => {
      let repository;

      beforeAll(async () => {
        repository = await Repository.findOne({
          type: 'github',
          externalId: '237888452',
        });
      });

      it('should have visibility "private"', () => {
        expect(repository.visibility).toBe('private');
      });
    });
  });

  describe('from pull request comment', () => {
    let status;

    beforeAll(() => SmartComment.deleteMany({}));

    beforeAll(async () => {
      token = await createAuthToken(user);
    });

    beforeAll(async () => {
      const body = {
        comment: 'These lines are very elegant',
        userId: user.id,
        location: 'files changed',
        suggestedComments: [],
        tags: [],
        githubMetadata: {
          commentId: 'r872534677',
          filename: 'apollo/src/app.js',
          line_numbers: [1, 2, 3],
          repo: 'phoenix',
          repo_id: '237888452',
          pull_number: 1713,
          url: 'https://github.com/Semalab/phoenix/pull/1713/files',
          base: 'develop',
          head: 'WEST-1421',
          created_at: '2020-12-17T18:41:44Z',
          updated_at: '2020-12-17T20:30:14Z',
          user: {
            id: '1270524',
            login: 'jrock17',
          },
          requester: 'codykenb',
        },
      };

      ({ status } = await apollo.post('/v1/comments/smart', body, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }));
    });

    it('should respond with 201 Created', async () => {
      expect(status).toBe(201);
    });

    describe('smart comment document', () => {
      let comment;

      beforeAll(async () => {
        comment = await SmartComment.findOne();
      });

      it('should have source provider', () => {
        expect(comment.source.provider).toBe('github');
      });

      it('should have source ID', () => {
        expect(comment.source.id).toBe('pullRequestComment:872534677');
      });

      it('should have source origin', () => {
        expect(comment.source.origin).toBe('extension');
      });

      it('should have GitHub metadata ID', () => {
        expect(comment.githubMetadata.id).toBe('872534677');
      });

      it('should have GitHub metadata type', () => {
        expect(comment.githubMetadata.type).toBe('pullRequestComment');
      });
    });
  });

  describe('from pull request comment reply', () => {
    let status;

    beforeAll(() => SmartComment.deleteMany({}));

    beforeAll(async () => {
      token = await createAuthToken(user);
    });

    beforeAll(async () => {
      const body = {
        comment: 'These lines are very elegant',
        userId: user.id,
        location: 'files changed',
        suggestedComments: [],
        tags: [],
        githubMetadata: {
          commentId: 'discussion_r872534677',
          filename: 'apollo/src/app.js',
          line_numbers: [1, 2, 3],
          repo: 'phoenix',
          repo_id: '237888452',
          pull_number: 1713,
          url: 'https://github.com/Semalab/phoenix/pull/1713/files',
          base: 'develop',
          head: 'WEST-1421',
          created_at: '2020-12-17T18:41:44Z',
          updated_at: '2020-12-17T20:30:14Z',
          user: {
            id: '1270524',
            login: 'jrock17',
          },
          requester: 'codykenb',
        },
      };

      ({ status } = await apollo.post('/v1/comments/smart', body, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }));
    });

    it('should respond with 201 Created', async () => {
      expect(status).toBe(201);
    });

    describe('smart comment document', () => {
      let comment;

      beforeAll(async () => {
        comment = await SmartComment.findOne();
      });

      it('should have source provider', () => {
        expect(comment.source.provider).toBe('github');
      });

      it('should have source ID', () => {
        expect(comment.source.id).toBe('pullRequestComment:872534677');
      });

      it('should have source origin', () => {
        expect(comment.source.origin).toBe('extension');
      });

      it('should have GitHub metadata ID', () => {
        expect(comment.githubMetadata.id).toBe('872534677');
      });

      it('should have GitHub metadata type', () => {
        expect(comment.githubMetadata.type).toBe('pullRequestComment');
      });
    });
  });

  describe('from pull request review', () => {
    let status;

    beforeAll(() => SmartComment.deleteMany({}));

    beforeAll(async () => {
      token = await createAuthToken(user);
    });

    beforeAll(async () => {
      const body = {
        comment: 'These lines are very elegant',
        userId: user.id,
        location: 'files changed',
        suggestedComments: [],
        tags: [],
        githubMetadata: {
          commentId: 'pullrequestreview-970002308',
          repo: 'phoenix',
          repo_id: '237888452',
          pull_number: 1713,
          url: 'https://github.com/Semalab/phoenix/pull/1713/files',
          base: 'develop',
          head: 'WEST-1421',
          created_at: '2020-12-17T18:41:44Z',
          updated_at: '2020-12-17T20:30:14Z',
          user: {
            id: '1270524',
            login: 'jrock17',
          },
          requester: 'codykenb',
        },
      };

      ({ status } = await apollo.post('/v1/comments/smart', body, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }));
    });

    it('should respond with 201 Created', async () => {
      expect(status).toBe(201);
    });

    describe('smart comment document', () => {
      let comment;

      beforeAll(async () => {
        comment = await SmartComment.findOne();
      });

      it('should have source provider', () => {
        expect(comment.source.provider).toBe('github');
      });

      it('should have source ID', () => {
        expect(comment.source.id).toBe('pullRequestReview:970002308');
      });

      it('should have source origin', () => {
        expect(comment.source.origin).toBe('extension');
      });

      it('should have GitHub metadata ID', () => {
        expect(comment.githubMetadata.id).toBe('970002308');
      });

      it('should have GitHub metadata type', () => {
        expect(comment.githubMetadata.type).toBe('pullRequestReview');
      });
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

    it.todo('should not create a comment');
  });
});
