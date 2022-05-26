import assert from 'assert';
import { addDays } from 'date-fns';
import nock from 'nock';
import resetNocks from '../../test/nocks';
import * as userService from '../users/userService';
import {
  findByExternalId as findSmartCommentsByExternalId,
  create as createSmartComment,
} from '../comments/smartComments/smartCommentService';
import { create as createRepository } from '../repositories/repositoryService';
import Repository from '../repositories/repositoryModel';
import SmartComment from '../comments/smartComments/smartCommentModel';
import handler from './importRepositoryQueue';

describe('Import Repository Queue', () => {
  let user;
  let repository;

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
          repositories: [],
        },
      ],
      terms: true,
    });
  });

  describe('newly added repository', () => {
    let comments;

    beforeAll(async () => {
      resetNocks();
      await Repository.deleteMany();
      await SmartComment.deleteMany();
    });

    beforeAll(async () => {
      repository = await createRepository({
        name: 'phoenix',
        type: 'github',
        id: '237888452',
        installationId: '25676597',
        addedBy: user,
        cloneUrl: 'https://github.com/Semalab/phoenix',
      });
    });

    it('should have sync status "queued"', () => {
      expect(repository.sync.status).toBe('queued');
    });

    describe('processing queue', () => {
      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, getFirstPageOfPullRequestComments(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=2&sort=created&direction=desc>; rel="next", <https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=2&sort=created&direction=desc>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 2 })
          .reply(200, getSecondPageOfPullRequestComments());
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, getFirstPageOfIssueComments(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/issues/comments?page=2&sort=created&direction=desc>; rel="next", <https://api.github.com/repos/Semalab/phoenix/issues/comments?page=2&sort=created&direction=desc>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 2 })
          .reply(200, getSecondPageOfIssueComments());
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, getFirstPageOfPullRequests(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls?page=2&sort=created&direction=desc>; rel="next", <https://api.github.com/repos/Semalab/phoenix/pulls?page=2&sort=created&direction=desc>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/pulls')
          .query({ sort: 'created', direction: 'desc', page: 2 })
          .reply(200, getSecondPageOfPullRequests())
          .get('/repos/Semalab/phoenix/pulls/3/reviews')
          .reply(200, getPullRequestReviewsForPR3())
          .get('/repos/Semalab/phoenix/pulls/4/reviews')
          .reply(200, []);
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/3')
          .reply(200, getPullRequestDetailPR3());
      });

      beforeAll(async () => {
        await handler({ id: repository.id });
      });

      beforeAll(async () => {
        comments = await findSmartCommentsByExternalId(repository.externalId);
      });

      it('should import seven comments', () => {
        expect(comments.length).toBe(7);
      });

      describe('first pull request comment', () => {
        let comment;

        beforeAll(() => {
          comment = comments.find(
            (c) => c.githubMetadata.type === 'pullRequestComment'
          );
        });

        it('should have source origin "repoSync"', () => {
          expect(comment.source.origin).toBe('repoSync');
        });

        it('should not reference a user', () => {
          expect(comment.userId).toBeUndefined();
        });

        it('should have comment body', () => {
          expect(comment.comment).toBe(
            '@jrock17 i know this is the logic you were referring to yesterday... looks awesome and elegant'
          );
        });

        it('should have reaction', () => {
          expect(comment.reaction).toEqualID('607f0d1ed7f45b000ec2ed71');
        });

        it('should have a tag', () => {
          expect(comment.tags.length).toBe(1);
          expect(comment.tags[0]).toEqualID('607f0594ab1bc1aecbe2ce51');
        });

        describe('GitHub metadata', () => {
          let githubMetadata;

          beforeAll(() => {
            githubMetadata = comment.githubMetadata;
          });

          it('should store the file name', () => {
            expect(githubMetadata.filename).toBe(
              'apollo/src/analysis/index.js'
            );
          });

          it('should store the repo name', () => {
            expect(githubMetadata.repo).toBe('phoenix');
          });

          it('should store the GitHub comment ID', () => {
            expect(githubMetadata.id).toBe('545317614');
          });

          it('should store the legacy GitHub comment ID field', () => {
            expect(githubMetadata.commentId).toBe('discussion_r545317614');
          });

          it('should store the GitHub repository ID', () => {
            expect(githubMetadata.repo_id).toBe('237888452');
          });

          it('should store the GitHub repository URL', () => {
            expect(githubMetadata.url).toBe(
              'https://github.com/Semalab/phoenix'
            );
          });

          it('should store the creation timestamp on GitHub', () => {
            expect(comment.source.createdAt).toEqual(
              new Date('2020-12-17T18:41:44Z')
            );
            expect(githubMetadata.created_at).toEqual(
              new Date('2020-12-17T18:41:44Z')
            );
          });

          it('should store the update timestamp on GitHub', () => {
            expect(githubMetadata.updated_at).toEqual(
              new Date('2020-12-17T20:30:14Z')
            );
          });

          it('should store the comment author details', () => {
            expect(githubMetadata.user.id).toBe('1270524');
            expect(githubMetadata.user.login).toBe('jrock17');
          });

          it('should store the pull request author details', () => {
            expect(githubMetadata.requester).toBe('codykenb');
          });
        });
      });

      describe('first pull request review comment', () => {
        let comment;

        beforeAll(() => {
          comment = comments.find(
            (c) => c.githubMetadata.type === 'pullRequestReview'
          );
        });

        it('should have source origin "repoSync"', () => {
          expect(comment.source.origin).toBe('repoSync');
        });

        it('should not reference a user', () => {
          expect(comment.userId).toBeUndefined();
        });

        it('should have comment body', () => {
          expect(comment.comment).toBe('LGTM');
        });

        it('should have the "No reaction" reaction', () => {
          expect(comment.reaction).toEqualID('607f0d1ed7f45b000ec2ed70');
        });

        it('should have no tags', () => {
          expect(comment.tags).toEqual([]);
        });

        describe('GitHub metadata', () => {
          let githubMetadata;

          beforeAll(() => {
            githubMetadata = comment.githubMetadata;
          });

          it('should store the file name', () => {
            expect(githubMetadata.filename).toBeFalsy();
          });

          it('should store the repo name', () => {
            expect(githubMetadata.repo).toBe('phoenix');
          });

          it('should store the GitHub comment ID', () => {
            expect(githubMetadata.id).toBe('368949349');
          });

          it('should store the legacy GitHub comment ID field', () => {
            expect(githubMetadata.commentId).toBe(
              'pullrequestreview-368949349'
            );
          });

          it('should store the GitHub repository ID', () => {
            expect(githubMetadata.repo_id).toBe('237888452');
          });

          it('should store the GitHub repository URL', () => {
            expect(githubMetadata.url).toBe(
              'https://github.com/Semalab/phoenix'
            );
          });

          it('should store the creation timestamp on GitHub', () => {
            expect(comment.source.createdAt).toEqual(
              new Date('2020-03-04T16:51:57Z')
            );
            expect(githubMetadata.created_at).toEqual(
              new Date('2020-03-04T16:51:57Z')
            );
          });

          it('should store the update timestamp on GitHub', () => {
            expect(githubMetadata.updated_at).toEqual(
              new Date('2020-03-04T16:51:57Z')
            );
          });

          it('should store the comment author details', () => {
            expect(githubMetadata.user.id).toBe('1045023');
            expect(githubMetadata.user.login).toBe('pangeaware');
          });

          it('should store the pull request author details', () => {
            expect(githubMetadata.requester).toBe('codykenb');
          });
        });
      });

      describe('first issue comment', () => {
        let comment;

        beforeAll(() => {
          comment = comments.find(
            (c) => c.githubMetadata.type === 'issueComment'
          );
        });

        it('should have source origin "repoSync"', () => {
          expect(comment.source.origin).toBe('repoSync');
        });

        it('should not reference a user', () => {
          expect(comment.userId).toBeUndefined();
        });

        it('should have comment body', () => {
          expect(comment.comment).toBe(
            'Test \r\n\r\n__\r\n[![sema-logo](https://app.semasoftware.com/img/sema-tray-logo.svg)](http://semasoftware.com/gh) &nbsp;**Summary:** :trophy: This code is awesome&nbsp; | &nbsp;**Tags:** Fault-tolerant\r\n'
          );
        });

        it('should have no tags', () => {
          expect(comment.tags).toEqual([]);
        });

        describe('GitHub metadata', () => {
          let githubMetadata;

          beforeAll(() => {
            githubMetadata = comment.githubMetadata;
          });

          it('should have no file name', () => {
            expect(githubMetadata.filename).toBe(null);
          });

          it('should store the repo name', () => {
            expect(githubMetadata.repo).toBe('phoenix');
          });

          it('should store the GitHub comment ID', () => {
            expect(githubMetadata.id).toBe('1130011291');
          });

          it('should store the legacy GitHub comment ID field', () => {
            expect(githubMetadata.commentId).toBe('issuecomment-1130011291');
          });

          it('should store the GitHub repository ID', () => {
            expect(githubMetadata.repo_id).toBe('237888452');
          });

          it('should store the GitHub repository URL', () => {
            expect(githubMetadata.url).toBe(
              'https://github.com/Semalab/phoenix'
            );
          });

          it('should store the creation timestamp on GitHub', () => {
            expect(comment.source.createdAt).toEqual(
              new Date('2022-05-18T13:21:37.000Z')
            );
            expect(githubMetadata.created_at).toEqual(
              new Date('2022-05-18T13:21:37.000Z')
            );
          });

          it('should store the update timestamp on GitHub', () => {
            expect(githubMetadata.updated_at).toEqual(
              new Date('2022-05-18T13:21:37.000Z')
            );
          });

          it('should store the comment author details', () => {
            expect(githubMetadata.user.id).toBe('28770143');
            expect(githubMetadata.user.login).toBe('jaymendez');
          });

          it('should store the pull request author details', () => {
            expect(githubMetadata.requester).toBe('codykenb');
          });
        });
      });

      describe('repository', () => {
        beforeAll(async () => {
          repository = await Repository.findById(repository._id);
        });

        it('should have sync status "completed"', () => {
          expect(repository.sync.status).toBe('completed');
        });

        it('should have sync completed at timestamp', () => {
          expect(repository.sync.completedAt).toBeCloseToDate(new Date());
        });
      });
    });

    describe('processing queue again', () => {
      beforeAll(() => {
        resetNocks();
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, getFirstPageOfPullRequestComments(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=2&sort=created&direction=desc>; rel="next", <https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=2&sort=created&direction=desc>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 2 })
          .reply(200, getSecondPageOfPullRequestComments());
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, getFirstPageOfIssueComments(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/issues/comments?page=2&sort=created&direction=desc>; rel="next", <https://api.github.com/repos/Semalab/phoenix/issues/comments?page=2&sort=created&direction=desc>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 2 })
          .reply(200, getSecondPageOfIssueComments());
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, getFirstPageOfPullRequests(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls?page=2&sort=created&direction=desc>; rel="next", <https://api.github.com/repos/Semalab/phoenix/pulls?page=2&sort=created&direction=desc>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/pulls')
          .query({ sort: 'created', direction: 'desc', page: 2 })
          .reply(200, getSecondPageOfPullRequests())
          .get('/repos/Semalab/phoenix/pulls/3/reviews')
          .reply(200, getPullRequestReviewsForPR3())
          .get('/repos/Semalab/phoenix/pulls/4/reviews')
          .reply(200, []);
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/3')
          .reply(200, getPullRequestDetailPR3());
      });

      beforeAll(async () => {
        await handler({ id: repository.id });
      });

      beforeAll(async () => {
        comments = await findSmartCommentsByExternalId(repository.externalId);
      });

      it('should import seven comments', () => {
        expect(comments.length).toBe(7);
      });
    });

    describe('when syncing pull request comments fails half-way through', () => {
      let handlerError;

      beforeAll(() => {
        resetNocks();
      });

      beforeAll(async () => {
        repository.sync = {};
        await repository.save();
        await SmartComment.deleteMany({});
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, getFirstPageOfPullRequestComments(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=2&sort=created&direction=desc>; rel="next", <https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=2&sort=created&direction=desc>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 2 })
          .reply(500, 'GitHub error');
      });

      beforeAll(() => {
        // Only test resuming of pull request comments.
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, [], {
            Link: '<https://api.github.com/repos/Semalab/phoenix/issues/comments?page=1&sort=created&direction=desc>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/pulls')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, [], {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=1&sort=created&direction=desc>; rel="last"',
          });
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/3')
          .reply(200, getPullRequestDetailPR3());
      });

      beforeAll(async () => {
        try {
          await handler({ id: repository.id });
        } catch (error) {
          handlerError = error;
        }
      });

      beforeAll(async () => {
        comments = await findSmartCommentsByExternalId(repository.externalId);
      });

      it('should fail', () => {
        expect(handlerError).toBeTruthy();
      });

      it('should import some comments', () => {
        expect(comments.length).toBe(2);
      });

      describe('repository', () => {
        beforeAll(async () => {
          repository = await Repository.findById(repository._id);
        });

        it('should have sync status "started"', () => {
          expect(repository.sync.status).toBe('started');
        });

        it('should have sync started at timestamp', () => {
          expect(repository.sync.startedAt).toBeCloseToDate(new Date());
        });

        it('should not have sync completed at timestamp', () => {
          expect(repository.sync.completedAt).toBeFalsy();
        });
      });

      describe('running job again', () => {
        beforeAll(() => {
          resetNocks();
        });

        beforeAll(() => {
          // Set the first page to always fail. This is to
          // ensure that the job can pick up pagination
          // where it left off.
          nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/pulls/comments')
            .query({ sort: 'created', direction: 'desc', page: 1 })
            .reply(500, 'GitHub error')
            .get('/repos/Semalab/phoenix/pulls/comments')
            .query({ sort: 'created', direction: 'desc', page: 2 })
            .reply(200, () => getSecondPageOfPullRequestComments());
        });

        beforeAll(() => {
          // Only test resuming of pull request comments.
          nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/issues/comments')
            .query({ sort: 'created', direction: 'desc', page: 1 })
            .reply(200, [])
            .get('/repos/Semalab/phoenix/pulls')
            .query({ sort: 'created', direction: 'desc', page: 1 })
            .reply(200, []);
        });

        beforeAll(() => {
          nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/pulls/3')
            .reply(200, getPullRequestDetailPR3());
        });

        beforeAll(async () => {
          await handler({ id: repository.id });
        });

        beforeAll(async () => {
          comments = await findSmartCommentsByExternalId(repository.externalId);
        });

        it('should import all pull request comments', () => {
          const pullRequestComments = comments.filter(
            (c) => c.githubMetadata.type === 'pullRequestComment'
          );
          expect(pullRequestComments.length).toBe(3);
        });

        describe('repository', () => {
          beforeAll(async () => {
            repository = await Repository.findById(repository._id);
          });

          it('should have sync status "completed"', () => {
            expect(repository.sync.status).toBe('completed');
          });

          it('should have sync completed at timestamp', () => {
            expect(repository.sync.completedAt).toBeCloseToDate(new Date());
          });
        });
      });
    });

    describe('when syncing issue comments fails half-way through', () => {
      let handlerError;

      beforeAll(() => {
        resetNocks();
      });

      beforeAll(async () => {
        repository.sync = {};
        await repository.save();
        await SmartComment.deleteMany({});
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, getFirstPageOfIssueComments(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/issues/comments?sort=created&direction=desc&page=2>; rel="next", <https://api.github.com/repos/Semalab/phoenix/issues/comments?sort=created&direction=desc&page=2>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 2 })
          .reply(500, 'GitHub Error');
      });

      beforeAll(() => {
        // Only test resuming of issue comments.
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, [], {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=1&sort=created&direction=desc>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/pulls')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, [], {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls?page=1&sort=created&direction=desc>; rel="last"',
          });
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/3')
          .reply(200, getPullRequestDetailPR3());
      });

      beforeAll(async () => {
        try {
          await handler({ id: repository.id });
        } catch (error) {
          handlerError = error;
        }
      });

      beforeAll(async () => {
        comments = await findSmartCommentsByExternalId(repository.externalId);
      });

      it('should fail', () => {
        expect(handlerError.message).toBe('GitHub Error');
      });

      it('should import some comments', () => {
        expect(comments.length).toBe(2);
      });

      describe('repository', () => {
        beforeAll(async () => {
          repository = await Repository.findById(repository._id);
        });

        it('should have sync status "started"', () => {
          expect(repository.sync.status).toBe('started');
        });

        it('should have sync started at timestamp', () => {
          expect(repository.sync.startedAt).toBeCloseToDate(new Date());
        });

        it('should not have sync completed at timestamp', () => {
          expect(repository.sync.completedAt).toBeFalsy();
        });
      });

      describe('running job again', () => {
        beforeAll(() => {
          // Set the first page to always fail. This is to
          // ensure that the job can pick up pagination
          // where it left off.
          nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/issues/comments')
            .query({ sort: 'created', direction: 'desc', page: 1 })
            .reply(500, 'GitHub error')
            .get('/repos/Semalab/phoenix/issues/comments')
            .query({ sort: 'created', direction: 'desc', page: 2 })
            .reply(200, getSecondPageOfIssueComments());
        });

        beforeAll(() => {
          // Only test resuming of issue comments.
          nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/pulls/comments')
            .query({ sort: 'created', direction: 'desc', page: 1 })
            .reply(200, [])
            .get('/repos/Semalab/phoenix/pulls')
            .query({ sort: 'created', direction: 'desc', page: 1 })
            .reply(200, []);
        });

        beforeAll(() => {
          nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/pulls/3')
            .reply(200, getPullRequestDetailPR3());
        });

        beforeAll(async () => {
          await handler({ id: repository.id });
        });

        beforeAll(async () => {
          comments = await findSmartCommentsByExternalId(repository.externalId);
        });

        it('should import all issue comments', () => {
          const issueComments = comments.filter(
            (c) => c.githubMetadata.type === 'issueComment'
          );
          expect(issueComments.length).toBe(3);
        });

        describe('repository', () => {
          beforeAll(async () => {
            repository = await Repository.findById(repository._id);
          });

          it('should have sync status "completed"', () => {
            expect(repository.sync.status).toBe('completed');
          });

          it('should have sync completed at timestamp', () => {
            expect(repository.sync.completedAt).toBeCloseToDate(new Date());
          });
        });
      });

      describe('running job again (after complete)', () => {
        let githubNock;

        beforeAll(() => {
          // Set the first page to always fail. This is to
          // ensure that the job is not re-importing the
          // issue comments if it already completed doing so
          // in a previous run.
          githubNock = nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/issues/comments')
            .query(() => true)
            .reply(500, 'GitHub error');
        });

        beforeAll(() => {
          // Only test resuming of issue comments.
          nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/pulls/comments')
            .query({ sort: 'created', direction: 'desc', page: 1 })
            .reply(200, [])
            .get('/repos/Semalab/phoenix/pulls')
            .query({ sort: 'created', direction: 'desc', page: 1 })
            .reply(200, []);
        });

        beforeAll(async () => {
          await handler({ id: repository.id });
        });

        it('should not query GitHub', async () => {
          expect(githubNock.isDone()).toBe(false);
        });
      });
    });

    describe('when syncing pull request reviews fails half-way through', () => {
      let handlerError;

      beforeAll(() => {
        resetNocks();
      });

      beforeAll(async () => {
        repository.sync = {};
        await repository.save();
        await SmartComment.deleteMany({});
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, getFirstPageOfPullRequests(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls?page=2&sort=created&direction=desc>; rel="next", <https://api.github.com/repos/Semalab/phoenix/pulls?page=2&sort=created&direction=desc>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/pulls')
          .query({ sort: 'created', direction: 'desc', page: 2 })
          .reply(500, 'GitHub Error')
          .get('/repos/Semalab/phoenix/pulls/3/reviews')
          .reply(200, getPullRequestReviewsForPR3())
          .get('/repos/Semalab/phoenix/pulls/4/reviews')
          .reply(200, getPullRequestReviewsForPR4());
      });

      beforeAll(() => {
        // Only test resuming of pull request reviews.
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, [], {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=1&sort=created&direction=desc>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, [], {
            Link: '<https://api.github.com/repos/Semalab/phoenix/issues/comments?page=1&sort=created&direction=desc>; rel="last"',
          });
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/3')
          .reply(200, getPullRequestDetailPR3())
          .get('/repos/Semalab/phoenix/pulls/4')
          .reply(200, getPullRequestDetailPR4());
      });

      beforeAll(async () => {
        try {
          await handler({ id: repository.id });
        } catch (error) {
          handlerError = error;
        }
      });

      beforeAll(async () => {
        comments = await findSmartCommentsByExternalId(repository.externalId);
      });

      it('should fail', () => {
        expect(handlerError.message).toBe('GitHub Error');
      });

      it('should import some comments', () => {
        expect(comments.length).toBe(1);
      });

      describe('repository', () => {
        beforeAll(async () => {
          repository = await Repository.findById(repository._id);
        });

        it('should have sync status "started"', () => {
          expect(repository.sync.status).toBe('started');
        });

        it('should have sync started at timestamp', () => {
          expect(repository.sync.startedAt).toBeCloseToDate(new Date());
        });

        it('should not have sync completed at timestamp', () => {
          expect(repository.sync.completedAt).toBeFalsy();
        });
      });

      describe('running job again', () => {
        beforeAll(() => {
          // Set the first page to always fail. This is to
          // ensure that the job can pick up pagination
          // where it left off.
          nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/pulls')
            .query({ sort: 'created', direction: 'desc', page: 1 })
            .reply(500, 'GitHub error')
            .get('/repos/Semalab/phoenix/pulls')
            .query({ sort: 'created', direction: 'desc', page: 2 })
            .reply(200, getSecondPageOfPullRequests())
            .get('/repos/Semalab/phoenix/pulls/3/reviews')
            .reply(200, getPullRequestReviewsForPR3())
            .get('/repos/Semalab/phoenix/pulls/4/reviews')
            .reply(200, getPullRequestReviewsForPR4());
        });

        beforeAll(() => {
          // Only test resuming of pull request reviews.
          nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/pulls/comments')
            .query({ sort: 'created', direction: 'desc', page: 1 })
            .reply(200, [], {
              Link: '<https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=1&sort=created&direction=desc>; rel="last"',
            })
            .get('/repos/Semalab/phoenix/issues/comments')
            .query({ sort: 'created', direction: 'desc', page: 1 })
            .reply(200, [], {
              Link: '<https://api.github.com/repos/Semalab/phoenix/issues/comments?page=1&sort=created&direction=desc>; rel="last"',
            });
        });

        beforeAll(() => {
          nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/pulls/3')
            .reply(200, getPullRequestDetailPR3())
            .get('/repos/Semalab/phoenix/pulls/4')
            .reply(200, getPullRequestDetailPR4());
        });

        beforeAll(async () => {
          await handler({ id: repository.id });
        });

        beforeAll(async () => {
          comments = await findSmartCommentsByExternalId(repository.externalId);
        });

        it('should import all pull request reviews', () => {
          const issueComments = comments.filter(
            (c) => c.githubMetadata.type === 'pullRequestReview'
          );
          expect(issueComments.length).toBe(2);
        });

        describe('repository', () => {
          beforeAll(async () => {
            repository = await Repository.findById(repository._id);
          });

          it('should have sync status "completed"', () => {
            expect(repository.sync.status).toBe('completed');
          });

          it('should have sync completed at timestamp', () => {
            expect(repository.sync.completedAt).toBeCloseToDate(new Date());
          });
        });
      });

      describe('running job again (after complete)', () => {
        let githubNock;

        beforeAll(() => {
          // Set the first page to always fail. This is to
          // ensure that the job is not re-importing the
          // issue comments if it already completed doing so
          // in a previous run.
          githubNock = nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/pulls')
            .query(() => true)
            .reply(500, 'GitHub error');
        });

        beforeAll(() => {
          // Only test resuming of issue comments.
          nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/issues/comments')
            .query({ sort: 'created', direction: 'desc', page: 1 })
            .reply(200, [])
            .get('/repos/Semalab/phoenix/pulls/comments')
            .query({ sort: 'created', direction: 'desc', page: 1 })
            .reply(200, []);
        });

        beforeAll(async () => {
          await handler({ id: repository.id });
        });

        it('should not query the GitHub API', () => {
          expect(githubNock.isDone()).toBe(false);
        });
      });
    });
  });

  describe('when another comment exists without ID', () => {
    let comment;

    beforeAll(async () => {
      resetNocks();
      await Repository.deleteMany();
      await SmartComment.deleteMany();
    });

    beforeAll(async () => {
      comment = await createSmartComment({
        comment:
          '@jrock17 this function feels like it should live somewhere else as well with repo code.',
        userId: user.id,
        location: 'files changed',
        suggestedComments: [],
        reaction: '607f0d1ed7f45b000ec2ed71',
        tags: [],
        githubMetadata: {
          // Comment ID must be null for this test.
          commentId: null,
          filename: null,
          repo: 'phoenix',
          repo_id: '237888452',
          url: 'https://github.com/Semalab/phoenix',
          // created_at intentionally within seconds of the value
          // provided by the API.
          created_at: '2020-12-17T18:35:00Z',
          updated_at: '2020-12-17T20:30:14Z',
          user: {
            id: '1045023',
            login: 'pangeaware',
          },
          requester: 'jrock17',
        },
      });

      await createSmartComment({
        comment: 'LGTM',
        userId: user.id,
        location: 'files changed',
        suggestedComments: [],
        reaction: null,
        tags: [],
        githubMetadata: {
          // Comment ID must be null for this test.
          commentId: null,
          filename: null,
          repo: 'phoenix',
          repo_id: '237888452',
          url: 'https://github.com/Semalab/phoenix',
          // created_at intentionally far away from the comment
          // provided by the API.
          created_at: '2020-12-17T18:25:00Z',
          updated_at: '2020-12-17T20:30:14Z',
          user: {
            id: '1045023',
            login: 'pangeaware',
          },
          requester: 'jrock17',
        },
      });
      assert.equal(await SmartComment.countDocuments(), 2);
    });

    beforeAll(async () => {
      repository = await createRepository({
        name: 'phoenix',
        type: 'github',
        id: '237888452',
        installationId: '25676597',
        addedBy: user,
        cloneUrl: 'https://github.com/Semalab/phoenix',
      });
    });

    beforeAll(() => {
      nock('https://api.github.com')
        .get('/repos/Semalab/phoenix/pulls/comments')
        .query({ sort: 'created', direction: 'desc', page: 1 })
        .reply(200, getFirstPageOfPullRequestComments().slice(0, 1), {
          Link: '<https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=1&sort=created&direction=desc>; rel="last"',
        })
        .get('/repos/Semalab/phoenix/issues/comments')
        .query({ sort: 'created', direction: 'desc', page: 1 })
        .reply(200, [])
        .get('/repos/Semalab/phoenix/pulls')
        .query({ sort: 'created', direction: 'desc', page: 1 })
        .reply(200, []);
    });

    beforeAll(() => {
      nock('https://api.github.com')
        .get('/repos/Semalab/phoenix/pulls/3')
        .reply(200, getPullRequestDetailPR3());
    });

    beforeAll(async () => {
      await handler({ id: repository.id });
    });

    it('should not create a new smart comment', async () => {
      const count = await SmartComment.countDocuments();
      expect(count).toBe(2);
    });

    describe('existing comment', () => {
      beforeAll(async () => {
        comment = await SmartComment.findById(comment._id);
      });

      it('should have GitHub ID', () => {
        expect(comment.githubMetadata.id).toBe('545313646');
        expect(comment.source.id).toBe('pullRequestComment:545313646');
      });
    });
  });

  describe('public repository', () => {
    let comments;

    beforeAll(async () => {
      resetNocks();
      await Repository.deleteMany();
      await SmartComment.deleteMany();
    });

    beforeAll(async () => {
      repository = await createRepository({
        name: 'phoenix',
        type: 'github',
        id: '237888452',
        addedBy: user,
        cloneUrl: 'https://github.com/Semalab/phoenix',
      });
    });

    describe('processing queue', () => {
      let defaultInstallationNock;

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/installation')
          .reply(404);

        defaultInstallationNock = nock('https://api.github.com')
          .persist()
          .get('/app/installations')
          .reply(200, [{ id: 35676598 }])
          .post('/app/installations/35676598/access_tokens', {})
          .reply(201, {
            token: 'ghs_3X0VGC4uvSelTLk3bbumXa8IycJNAx3I0j2z',
            expires_at: addDays(new Date(), 1).toISOString(),
            permissions: {
              members: 'read',
              organization_administration: 'read',
              organization_projects: 'read',
              actions: 'read',
              administration: 'read',
              contents: 'read',
              discussions: 'write',
              issues: 'write',
              metadata: 'read',
              pull_requests: 'write',
              repository_hooks: 'write',
              repository_projects: 'read',
              vulnerability_alerts: 'read',
            },
            repository_selection: 'selected',
          });
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, getFirstPageOfPullRequestComments(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=1&sort=created&direction=desc>; rel="last"',
          });
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/issues/comments')
          .query(() => true)
          .reply(200, []);
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls')
          .query(() => true)
          .reply(200, []);
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/3')
          .reply(200, getPullRequestDetailPR3());
      });

      beforeAll(async () => {
        await handler({ id: repository.id });
      });

      beforeAll(async () => {
        comments = await findSmartCommentsByExternalId(repository.externalId);
      });

      it('should import comments', () => {
        expect(comments.length).toBe(2);
      });

      it('should use any installation ID', () => {
        expect(defaultInstallationNock.isDone()).toBe(true);
      });
    });
  });
});

function getFirstPageOfPullRequestComments() {
  return [
    {
      url: 'https://api.github.com/repos/Semalab/phoenix/pulls/comments/545313646',
      pull_request_review_id: 554880620,
      id: 545313646,
      node_id: 'MDI0OlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDU0NTMxMzY0Ng==',
      commit_id: '7db0665a4c0f7e496d96920f1fe0db207bb4437c',
      original_commit_id: '43d87631f9550c05ef2786513d76b4ba49c6aadb',
      user: {
        login: 'pangeaware',
        id: 1045023,
        type: 'User',
      },
      body: '@jrock17 this function feels like it should live somewhere else as well with repo code.',
      created_at: '2020-12-17T18:35:40Z',
      updated_at: '2020-12-17T20:30:14Z',
      pull_request_url: 'https://api.github.com/repos/Semalab/phoenix/pulls/3',
    },
    {
      url: 'https://api.github.com/repos/Semalab/phoenix/pulls/comments/545317389',
      pull_request_review_id: 554885055,
      id: 545317389,
      node_id: 'MDI0OlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDU0NTMxNzM4OQ==',
      diff_hunk:
        '@@ -0,0 +1,13 @@\n' +
        "+import mongoose from 'mongoose';\n" +
        "+import { autoIndex } from '../config';\n" +
        '+\n' +
        '+const analysisSchema = new mongoose.Schema({\n' +
        "+  repositoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository', required: true },\n" +
        '+  runId: { type: String, required: true },',
      path: 'apollo/src/analysis/analysisModel.js',
      commit_id: '7db0665a4c0f7e496d96920f1fe0db207bb4437c',
      original_commit_id: '43d87631f9550c05ef2786513d76b4ba49c6aadb',
      user: {
        login: 'jrock17',
        id: 1270524,
        node_id: 'MDQ6VXNlcjEyNzA1MjQ=',
        avatar_url: 'https://avatars.githubusercontent.com/u/1270524?v=4',
        type: 'User',
      },
      body: 'Renamed to `completedAt` since that mirrors the timestamp vars like `createdAt`',
      created_at: '2020-12-17T18:41:25Z',
      updated_at: '2020-12-17T20:30:14Z',
      html_url:
        'https://github.com/Semalab/phoenix/pull/92#discussion_r545317389',
      pull_request_url: 'https://api.github.com/repos/Semalab/phoenix/pulls/3',
      in_reply_to_id: 545307346,
    },
  ];
}

function getSecondPageOfPullRequestComments() {
  return [
    {
      url: 'https://api.github.com/repos/Semalab/phoenix/pulls/comments/545317614',
      pull_request_review_id: 554885302,
      id: 545317614,
      node_id: 'MDI0OlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDU0NTMxNzYxNA==',
      diff_hunk:
        '@@ -0,0 +1,51 @@\n' +
        "+import { Router } from 'express';\n" +
        "+import { version } from '../config';\n" +
        "+import logger from '../shared/logger';\n" +
        "+import errors from '../shared/errors';\n",
      path: 'apollo/src/analysis/index.js',
      commit_id: '7db0665a4c0f7e496d96920f1fe0db207bb4437c',
      original_commit_id: '43d87631f9550c05ef2786513d76b4ba49c6aadb',
      user: {
        login: 'jrock17',
        id: 1270524,
        node_id: 'MDQ6VXNlcjEyNzA1MjQ=',
        avatar_url: 'https://avatars.githubusercontent.com/u/1270524?v=4',
        type: 'User',
      },
      body: '@jrock17 i know this is the logic you were referring to yesterday... looks awesome and elegant',
      created_at: '2020-12-17T18:41:44Z',
      updated_at: '2020-12-17T20:30:14Z',
      html_url:
        'https://github.com/Semalab/phoenix/pull/92#discussion_r545317614',
      pull_request_url: 'https://api.github.com/repos/Semalab/phoenix/pulls/3',
    },
  ];
}

function getPullRequestDetailPR3() {
  return {
    url: 'https://api.github.com/repos/Semalab/phoenix/pulls/3',
    id: 383552850,
    node_id: 'MDExOlB1bGxSZXF1ZXN0MzgzNTUyODUw',
    html_url: 'https://github.com/Semalab/phoenix/pull/3',
    issue_url: 'https://api.github.com/repos/Semalab/phoenix/issues/3',
    number: 3,
    state: 'closed',
    locked: false,
    title: 'SP-224: Add reporting page, state, and wire up to API calls',
    user: {
      login: 'codykenb',
      id: 6106595,
      node_id: 'MDQ6VXNlcjYxMDY1OTU=',
      avatar_url: 'https://avatars.githubusercontent.com/u/6106595?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/codykenb',
      html_url: 'https://github.com/codykenb',
      type: 'User',
      site_admin: false,
    },
    body: '',
    created_at: '2020-03-04T13:24:05Z',
    updated_at: '2020-07-30T14:56:13Z',
    closed_at: '2020-03-04T19:29:26Z',
    merged_at: '2020-03-04T19:29:26Z',
    merge_commit_sha: '5586e1fbc2058552232b6e04bde865f0c7c017c7',
    draft: false,
    head: {
      label: 'Semalab:SP-224',
      ref: 'SP-224',
      sha: '5cf414e8a9cc594cdef7b73156c8adaf68191724',
      user: {
        login: 'Semalab',
        id: 31629704,
        node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
        avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/Semalab',
        html_url: 'https://github.com/Semalab',
        type: 'Organization',
        site_admin: false,
      },
      repo: {
        id: 237888452,
        node_id: 'MDEwOlJlcG9zaXRvcnkyMzc4ODg0NTI=',
        name: 'phoenix',
        full_name: 'Semalab/phoenix',
        private: true,
        owner: {
          login: 'Semalab',
          id: 31629704,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
          avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/Semalab',
          html_url: 'https://github.com/Semalab',
          type: 'Organization',
          site_admin: false,
        },
        html_url: 'https://github.com/Semalab/phoenix',
        description: 'Sema Code Quality Platform Web App',
        created_at: '2020-02-03T05:00:24Z',
        updated_at: '2022-01-10T16:48:10Z',
        pushed_at: '2022-05-16T18:59:54Z',
        clone_url: 'https://github.com/Semalab/phoenix.git',
      },
    },
    base: {
      label: 'Semalab:qa',
      ref: 'qa',
      sha: '0eb67e6907592253463eff8d6d21f3494b2213ca',
      user: {
        login: 'Semalab',
        id: 31629704,
        node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
        avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/Semalab',
        html_url: 'https://github.com/Semalab',
        type: 'Organization',
        site_admin: false,
      },
      repo: {
        id: 237888452,
        node_id: 'MDEwOlJlcG9zaXRvcnkyMzc4ODg0NTI=',
        name: 'phoenix',
        full_name: 'Semalab/phoenix',
        private: true,
        owner: {
          login: 'Semalab',
          id: 31629704,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
          avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/Semalab',
          html_url: 'https://github.com/Semalab',
          type: 'Organization',
          site_admin: false,
        },
        html_url: 'https://github.com/Semalab/phoenix',
        description: 'Sema Code Quality Platform Web App',
        created_at: '2020-02-03T05:00:24Z',
        updated_at: '2022-01-10T16:48:10Z',
        pushed_at: '2022-05-16T18:59:54Z',
        clone_url: 'https://github.com/Semalab/phoenix.git',
      },
    },
    comments: 1,
    review_comments: 16,
    maintainer_can_modify: false,
    commits: 28,
    additions: 2718,
    deletions: 2283,
    changed_files: 21,
  };
}

function getPullRequestDetailPR4() {
  return {
    url: 'https://api.github.com/repos/Semalab/phoenix/pulls/4',
    id: 388073838,
    node_id: 'MDExOlB1bGxSZXF1ZXN0Mzg4MDczODM4',
    html_url: 'https://github.com/Semalab/phoenix/pull/4',
    diff_url: 'https://github.com/Semalab/phoenix/pull/4.diff',
    patch_url: 'https://github.com/Semalab/phoenix/pull/4.patch',
    issue_url: 'https://api.github.com/repos/Semalab/phoenix/issues/4',
    number: 4,
    state: 'closed',
    locked: false,
    title:
      'SP-22: Add dynamic filters on reports page and integration Mode iframe',
    user: {
      login: 'jrock17',
      id: 1270524,
      node_id: 'MDQ6VXNlcjEyNzA1MjQ=',
      avatar_url: 'https://avatars.githubusercontent.com/u/1270524?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/jrock17',
      html_url: 'https://github.com/jrock17',
      type: 'User',
      site_admin: false,
    },
    body: '',
    created_at: '2020-03-14T00:11:52Z',
    updated_at: '2020-03-18T21:34:03Z',
    closed_at: '2020-03-18T21:34:03Z',
    merged_at: '2020-03-18T21:34:02Z',
    merge_commit_sha: '1ed82fe7cebdaaa235570eb83b66be92252eaa57',
    assignee: null,
    assignees: [],
    requested_reviewers: [],
    requested_teams: [],
    labels: [],
    milestone: null,
    draft: false,
    head: {
      label: 'Semalab:SP-22',
      ref: 'SP-22',
      sha: '1447357503c3692674e0ee40b1f578b4d902c90d',
      user: {
        login: 'Semalab',
        id: 31629704,
        node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
        avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/Semalab',
        html_url: 'https://github.com/Semalab',
        type: 'Organization',
        site_admin: false,
      },
      repo: {
        id: 237888452,
        node_id: 'MDEwOlJlcG9zaXRvcnkyMzc4ODg0NTI=',
        name: 'phoenix',
        full_name: 'Semalab/phoenix',
        private: true,
        owner: {
          login: 'Semalab',
          id: 31629704,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
          avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/Semalab',
          html_url: 'https://github.com/Semalab',
          type: 'Organization',
          site_admin: false,
        },
        html_url: 'https://github.com/Semalab/phoenix',
        description: 'Sema Code Quality Platform Web App',
        fork: false,
        url: 'https://api.github.com/repos/Semalab/phoenix',
        created_at: '2020-02-03T05:00:24Z',
        updated_at: '2022-01-10T16:48:10Z',
        pushed_at: '2022-05-23T18:34:08Z',
        clone_url: 'https://github.com/Semalab/phoenix.git',
        homepage: '',
        size: 61653,
        stargazers_count: 0,
        watchers_count: 0,
        language: 'JavaScript',
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: false,
        forks_count: 1,
        mirror_url: null,
        archived: false,
        disabled: false,
        open_issues_count: 32,
        license: null,
        allow_forking: true,
        is_template: false,
        topics: [],
        visibility: 'private',
        forks: 1,
        open_issues: 32,
        watchers: 0,
        default_branch: 'develop',
      },
    },
    base: {
      label: 'Semalab:qa',
      ref: 'qa',
      sha: '5586e1fbc2058552232b6e04bde865f0c7c017c7',
      user: {
        login: 'Semalab',
        id: 31629704,
        node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
        avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/Semalab',
        html_url: 'https://github.com/Semalab',
        type: 'Organization',
        site_admin: false,
      },
      repo: {
        id: 237888452,
        node_id: 'MDEwOlJlcG9zaXRvcnkyMzc4ODg0NTI=',
        name: 'phoenix',
        full_name: 'Semalab/phoenix',
        private: true,
        owner: {
          login: 'Semalab',
          id: 31629704,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
          avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/Semalab',
          html_url: 'https://github.com/Semalab',
          type: 'Organization',
          site_admin: false,
        },
        html_url: 'https://github.com/Semalab/phoenix',
        description: 'Sema Code Quality Platform Web App',
        fork: false,
        url: 'https://api.github.com/repos/Semalab/phoenix',
        created_at: '2020-02-03T05:00:24Z',
        updated_at: '2022-01-10T16:48:10Z',
        pushed_at: '2022-05-23T18:34:08Z',
        clone_url: 'https://github.com/Semalab/phoenix.git',
        homepage: '',
        size: 61653,
        stargazers_count: 0,
        watchers_count: 0,
        language: 'JavaScript',
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: false,
        forks_count: 1,
        mirror_url: null,
        archived: false,
        disabled: false,
        open_issues_count: 32,
        license: null,
        allow_forking: true,
        is_template: false,
        topics: [],
        visibility: 'private',
        forks: 1,
        open_issues: 32,
        watchers: 0,
        default_branch: 'develop',
      },
    },
    author_association: 'CONTRIBUTOR',
    auto_merge: null,
    active_lock_reason: null,
    merged: true,
    mergeable: null,
    rebaseable: null,
    mergeable_state: 'unknown',
    merged_by: {
      login: 'pangeaware',
      id: 1045023,
      node_id: 'MDQ6VXNlcjEwNDUwMjM=',
      avatar_url: 'https://avatars.githubusercontent.com/u/1045023?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/pangeaware',
      html_url: 'https://github.com/pangeaware',
      type: 'User',
      site_admin: false,
    },
    comments: 3,
    review_comments: 4,
    maintainer_can_modify: false,
    commits: 48,
    additions: 543,
    deletions: 35,
    changed_files: 18,
  };
}

function getFirstPageOfIssueComments() {
  return [
    {
      url: 'https://api.github.com/repos/Semalab/phoenix/issues/comments/1130011291',
      html_url:
        'https://github.com/Semalab/phoenix/pull/3#issuecomment-1130011291',
      issue_url: 'https://api.github.com/repos/Semalab/phoenix/issues/3',
      id: 1130011291,
      node_id: 'IC_kwDODi3jxM5DWpqb',
      user: {
        login: 'jaymendez',
        id: 28770143,
        node_id: 'MDQ6VXNlcjI4NzcwMTQz',
        avatar_url: 'https://avatars.githubusercontent.com/u/28770143?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/jaymendez',
        html_url: 'https://github.com/jaymendez',
        type: 'User',
        site_admin: false,
      },
      created_at: '2022-05-18T13:21:37Z',
      updated_at: '2022-05-18T13:21:37Z',
      author_association: 'CONTRIBUTOR',
      body: 'Test \r\n\r\n__\r\n[![sema-logo](https://app.semasoftware.com/img/sema-tray-logo.svg)](http://semasoftware.com/gh) &nbsp;**Summary:** :trophy: This code is awesome&nbsp; | &nbsp;**Tags:** Fault-tolerant\r\n',
      reactions: {
        'url':
          'https://api.github.com/repos/Semalab/phoenix/issues/comments/1130011291/reactions',
        'total_count': 0,
        '+1': 0,
        '-1': 0,
        'laugh': 0,
        'hooray': 0,
        'confused': 0,
        'heart': 0,
        'rocket': 0,
        'eyes': 0,
      },
      performed_via_github_app: null,
    },
    {
      url: 'https://api.github.com/repos/Semalab/phoenix/issues/comments/1130010655',
      html_url:
        'https://github.com/Semalab/phoenix/pull/3#issuecomment-1130010655',
      issue_url: 'https://api.github.com/repos/Semalab/phoenix/issues/3',
      id: 1130010655,
      node_id: 'IC_kwDODi3jxM5DWpgf',
      user: {
        login: 'jaymendez',
        id: 28770143,
        node_id: 'MDQ6VXNlcjI4NzcwMTQz',
        avatar_url: 'https://avatars.githubusercontent.com/u/28770143?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/jaymendez',
        html_url: 'https://github.com/jaymendez',
        type: 'User',
        site_admin: false,
      },
      created_at: '2022-05-18T13:21:07Z',
      updated_at: '2022-05-18T13:21:07Z',
      author_association: 'CONTRIBUTOR',
      body: 'Test\r\n\r\n__\r\n[![sema-logo](https://app.semasoftware.com/img/sema-tray-logo.svg)](http://semasoftware.com/gh) &nbsp;**Tags:** Not maintainable\r\n',
      reactions: {
        'url':
          'https://api.github.com/repos/Semalab/phoenix/issues/comments/1130010655/reactions',
        'total_count': 0,
        '+1': 0,
        '-1': 0,
        'laugh': 0,
        'hooray': 0,
        'confused': 0,
        'heart': 0,
        'rocket': 0,
        'eyes': 0,
      },
      performed_via_github_app: null,
    },
    {
      url: 'https://api.github.com/repos/Semalab/phoenix/issues/comments/1130011292',
      html_url:
        'https://github.com/Semalab/phoenix/issues/3#issuecomment-1130011292',
      issue_url: 'https://api.github.com/repos/Semalab/phoenix/issues/3',
      id: 1130011292,
      node_id: 'IC_kwDODi3jxM5DWpqb',
      user: {
        login: 'jaymendez',
        id: 28770143,
        node_id: 'MDQ6VXNlcjI4NzcwMTQz',
        avatar_url: 'https://avatars.githubusercontent.com/u/28770143?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/jaymendez',
        html_url: 'https://github.com/jaymendez',
        type: 'User',
        site_admin: false,
      },
      created_at: '2022-06-18T13:21:37Z',
      updated_at: '2022-06-18T13:21:37Z',
      author_association: 'CONTRIBUTOR',
      body: 'A test',
      reactions: {
        'url':
          'https://api.github.com/repos/Semalab/phoenix/issues/comments/1130011292/reactions',
        'total_count': 0,
        '+1': 0,
        '-1': 0,
        'laugh': 0,
        'hooray': 0,
        'confused': 0,
        'heart': 0,
        'rocket': 0,
        'eyes': 0,
      },
      performed_via_github_app: null,
    },
  ];
}

function getSecondPageOfIssueComments() {
  return [
    {
      url: 'https://api.github.com/repos/Semalab/phoenix/issues/comments/1130010546',
      html_url:
        'https://github.com/Semalab/phoenix/pull/3#issuecomment-1130010546',
      issue_url: 'https://api.github.com/repos/Semalab/phoenix/issues/3',
      id: 1130010546,
      node_id: 'IC_kwDODi3jxM5DWpey',
      user: {
        login: 'jaymendez',
        id: 28770143,
        node_id: 'MDQ6VXNlcjI4NzcwMTQz',
        avatar_url: 'https://avatars.githubusercontent.com/u/28770143?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/jaymendez',
        html_url: 'https://github.com/jaymendez',
        type: 'User',
        site_admin: false,
      },
      created_at: '2022-05-18T13:21:01Z',
      updated_at: '2022-05-18T13:21:01Z',
      author_association: 'CONTRIBUTOR',
      body: 'Test Comment\r\n\r\n',
      reactions: {
        'url':
          'https://api.github.com/repos/Semalab/phoenix/issues/comments/1130010546/reactions',
        'total_count': 0,
        '+1': 0,
        '-1': 0,
        'laugh': 0,
        'hooray': 0,
        'confused': 0,
        'heart': 0,
        'rocket': 0,
        'eyes': 0,
      },
      performed_via_github_app: null,
    },
  ];
}

function getFirstPageOfPullRequests() {
  return [
    {
      url: 'https://api.github.com/repos/Semalab/phoenix/pulls/4',
      id: 388073838,
      node_id: 'MDExOlB1bGxSZXF1ZXN0Mzg4MDczODM4',
      html_url: 'https://github.com/Semalab/phoenix/pull/4',
      diff_url: 'https://github.com/Semalab/phoenix/pull/4.diff',
      patch_url: 'https://github.com/Semalab/phoenix/pull/4.patch',
      issue_url: 'https://api.github.com/repos/Semalab/phoenix/issues/4',
      number: 4,
      state: 'closed',
      locked: false,
      title:
        'SP-22: Add dynamic filters on reports page and integration Mode iframe',
      user: {
        login: 'jrock17',
        id: 1270524,
        node_id: 'MDQ6VXNlcjEyNzA1MjQ=',
        avatar_url: 'https://avatars.githubusercontent.com/u/1270524?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/jrock17',
        html_url: 'https://github.com/jrock17',
        type: 'User',
        site_admin: false,
      },
      body: '',
      created_at: '2020-03-14T00:11:52Z',
      updated_at: '2020-03-18T21:34:03Z',
      closed_at: '2020-03-18T21:34:03Z',
      merged_at: '2020-03-18T21:34:02Z',
      merge_commit_sha: '1ed82fe7cebdaaa235570eb83b66be92252eaa57',
      assignee: null,
      assignees: [],
      requested_reviewers: [],
      requested_teams: [],
      labels: [],
      milestone: null,
      draft: false,
      head: {
        label: 'Semalab:SP-22',
        ref: 'SP-22',
        sha: '1447357503c3692674e0ee40b1f578b4d902c90d',
        user: {
          login: 'Semalab',
          id: 31629704,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
          avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/Semalab',
          html_url: 'https://github.com/Semalab',
          type: 'Organization',
          site_admin: false,
        },
        repo: {
          id: 237888452,
          node_id: 'MDEwOlJlcG9zaXRvcnkyMzc4ODg0NTI=',
          name: 'phoenix',
          full_name: 'Semalab/phoenix',
          private: true,
          owner: {
            login: 'Semalab',
            id: 31629704,
            node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
            avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
            gravatar_id: '',
            url: 'https://api.github.com/users/Semalab',
            html_url: 'https://github.com/Semalab',
            type: 'Organization',
            site_admin: false,
          },
          html_url: 'https://github.com/Semalab/phoenix',
          description: 'Sema Code Quality Platform Web App',
          fork: false,
          url: 'https://api.github.com/repos/Semalab/phoenix',
          created_at: '2020-02-03T05:00:24Z',
          updated_at: '2022-01-10T16:48:10Z',
          pushed_at: '2022-05-18T18:35:35Z',
          clone_url: 'https://github.com/Semalab/phoenix.git',
          homepage: '',
          size: 61619,
          stargazers_count: 0,
          watchers_count: 0,
          language: 'JavaScript',
          has_issues: true,
          has_projects: true,
          has_downloads: true,
          has_wiki: true,
          has_pages: false,
          forks_count: 1,
          mirror_url: null,
          archived: false,
          disabled: false,
          open_issues_count: 34,
          license: null,
          allow_forking: true,
          is_template: false,
          topics: [],
          visibility: 'private',
          forks: 1,
          open_issues: 34,
          watchers: 0,
          default_branch: 'develop',
        },
      },
      base: {
        label: 'Semalab:qa',
        ref: 'qa',
        sha: '5586e1fbc2058552232b6e04bde865f0c7c017c7',
        user: {
          login: 'Semalab',
          id: 31629704,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
          avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/Semalab',
          html_url: 'https://github.com/Semalab',
          type: 'Organization',
          site_admin: false,
        },
        repo: {
          id: 237888452,
          node_id: 'MDEwOlJlcG9zaXRvcnkyMzc4ODg0NTI=',
          name: 'phoenix',
          full_name: 'Semalab/phoenix',
          private: true,
          owner: {
            login: 'Semalab',
            id: 31629704,
            node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
            avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
            gravatar_id: '',
            url: 'https://api.github.com/users/Semalab',
            html_url: 'https://github.com/Semalab',
            type: 'Organization',
            site_admin: false,
          },
          html_url: 'https://github.com/Semalab/phoenix',
          description: 'Sema Code Quality Platform Web App',
          fork: false,
          url: 'https://api.github.com/repos/Semalab/phoenix',
          created_at: '2020-02-03T05:00:24Z',
          updated_at: '2022-01-10T16:48:10Z',
          pushed_at: '2022-05-18T18:35:35Z',
          clone_url: 'https://github.com/Semalab/phoenix.git',
          homepage: '',
          size: 61619,
          stargazers_count: 0,
          watchers_count: 0,
          language: 'JavaScript',
          has_issues: true,
          has_projects: true,
          has_downloads: true,
          has_wiki: true,
          has_pages: false,
          forks_count: 1,
          mirror_url: null,
          archived: false,
          disabled: false,
          open_issues_count: 34,
          license: null,
          allow_forking: true,
          is_template: false,
          topics: [],
          visibility: 'private',
          forks: 1,
          open_issues: 34,
          watchers: 0,
          default_branch: 'develop',
        },
      },
      author_association: 'CONTRIBUTOR',
      auto_merge: null,
      active_lock_reason: null,
      merged: true,
      mergeable: null,
      rebaseable: null,
      mergeable_state: 'unknown',
      merged_by: {
        login: 'pangeaware',
        id: 1045023,
        node_id: 'MDQ6VXNlcjEwNDUwMjM=',
        avatar_url: 'https://avatars.githubusercontent.com/u/1045023?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/pangeaware',
        html_url: 'https://github.com/pangeaware',
        type: 'User',
        site_admin: false,
      },
      comments: 3,
      review_comments: 4,
      maintainer_can_modify: false,
      commits: 48,
      additions: 543,
      deletions: 35,
      changed_files: 18,
    },
  ];
}

function getSecondPageOfPullRequests() {
  return [
    {
      url: 'https://api.github.com/repos/Semalab/phoenix/pulls/3',
      id: 383552850,
      node_id: 'MDExOlB1bGxSZXF1ZXN0MzgzNTUyODUw',
      html_url: 'https://github.com/Semalab/phoenix/pull/3',
      diff_url: 'https://github.com/Semalab/phoenix/pull/3.diff',
      patch_url: 'https://github.com/Semalab/phoenix/pull/3.patch',
      issue_url: 'https://api.github.com/repos/Semalab/phoenix/issues/3',
      number: 3,
      state: 'closed',
      locked: false,
      title: 'SP-224: Add reporting page, state, and wire up to API calls',
      user: {
        login: 'jrock17',
        id: 1270524,
        node_id: 'MDQ6VXNlcjEyNzA1MjQ=',
        avatar_url: 'https://avatars.githubusercontent.com/u/1270524?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/jrock17',
        html_url: 'https://github.com/jrock17',
        type: 'User',
        site_admin: false,
      },
      body: '',
      created_at: '2020-03-04T13:24:05Z',
      updated_at: '2020-07-30T14:56:13Z',
      closed_at: '2020-03-04T19:29:26Z',
      merged_at: '2020-03-04T19:29:26Z',
      merge_commit_sha: '5586e1fbc2058552232b6e04bde865f0c7c017c7',
      assignee: null,
      assignees: [],
      requested_reviewers: [],
      requested_teams: [],
      labels: [],
      milestone: null,
      draft: false,
      head: {
        label: 'Semalab:SP-224',
        ref: 'SP-224',
        sha: '5cf414e8a9cc594cdef7b73156c8adaf68191724',
        user: {
          login: 'Semalab',
          id: 31629704,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
          avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/Semalab',
          html_url: 'https://github.com/Semalab',
          type: 'Organization',
          site_admin: false,
        },
        repo: {
          id: 237888452,
          node_id: 'MDEwOlJlcG9zaXRvcnkyMzc4ODg0NTI=',
          name: 'phoenix',
          full_name: 'Semalab/phoenix',
          private: true,
          owner: {
            login: 'Semalab',
            id: 31629704,
            node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
            avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
            gravatar_id: '',
            url: 'https://api.github.com/users/Semalab',
            html_url: 'https://github.com/Semalab',
            type: 'Organization',
            site_admin: false,
          },
          html_url: 'https://github.com/Semalab/phoenix',
          description: 'Sema Code Quality Platform Web App',
          fork: false,
          url: 'https://api.github.com/repos/Semalab/phoenix',
          created_at: '2020-02-03T05:00:24Z',
          updated_at: '2022-01-10T16:48:10Z',
          pushed_at: '2022-05-18T18:35:35Z',
          clone_url: 'https://github.com/Semalab/phoenix.git',
          homepage: '',
          size: 61619,
          stargazers_count: 0,
          watchers_count: 0,
          language: 'JavaScript',
          has_issues: true,
          has_projects: true,
          has_downloads: true,
          has_wiki: true,
          has_pages: false,
          forks_count: 1,
          mirror_url: null,
          archived: false,
          disabled: false,
          open_issues_count: 34,
          license: null,
          allow_forking: true,
          is_template: false,
          topics: [],
          visibility: 'private',
          forks: 1,
          open_issues: 34,
          watchers: 0,
          default_branch: 'develop',
        },
      },
      base: {
        label: 'Semalab:qa',
        ref: 'qa',
        sha: '0eb67e6907592253463eff8d6d21f3494b2213ca',
        user: {
          login: 'Semalab',
          id: 31629704,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
          avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/Semalab',
          html_url: 'https://github.com/Semalab',
          type: 'Organization',
          site_admin: false,
        },
        repo: {
          id: 237888452,
          node_id: 'MDEwOlJlcG9zaXRvcnkyMzc4ODg0NTI=',
          name: 'phoenix',
          full_name: 'Semalab/phoenix',
          private: true,
          owner: {
            login: 'Semalab',
            id: 31629704,
            node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
            avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
            gravatar_id: '',
            url: 'https://api.github.com/users/Semalab',
            html_url: 'https://github.com/Semalab',
            type: 'Organization',
            site_admin: false,
          },
          html_url: 'https://github.com/Semalab/phoenix',
          description: 'Sema Code Quality Platform Web App',
          fork: false,
          url: 'https://api.github.com/repos/Semalab/phoenix',
          created_at: '2020-02-03T05:00:24Z',
          updated_at: '2022-01-10T16:48:10Z',
          pushed_at: '2022-05-18T18:35:35Z',
          git_url: 'git://github.com/Semalab/phoenix.git',
          ssh_url: 'git@github.com:Semalab/phoenix.git',
          clone_url: 'https://github.com/Semalab/phoenix.git',
          svn_url: 'https://github.com/Semalab/phoenix',
          homepage: '',
          size: 61619,
          stargazers_count: 0,
          watchers_count: 0,
          language: 'JavaScript',
          has_issues: true,
          has_projects: true,
          has_downloads: true,
          has_wiki: true,
          has_pages: false,
          forks_count: 1,
          mirror_url: null,
          archived: false,
          disabled: false,
          open_issues_count: 34,
          license: null,
          allow_forking: true,
          is_template: false,
          topics: [],
          visibility: 'private',
          forks: 1,
          open_issues: 34,
          watchers: 0,
          default_branch: 'develop',
        },
      },
      author_association: 'CONTRIBUTOR',
      auto_merge: null,
      active_lock_reason: null,
      merged: true,
      mergeable: null,
      rebaseable: null,
      mergeable_state: 'unknown',
      merged_by: {
        login: 'pangeaware',
        id: 1045023,
        node_id: 'MDQ6VXNlcjEwNDUwMjM=',
        avatar_url: 'https://avatars.githubusercontent.com/u/1045023?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/pangeaware',
        html_url: 'https://github.com/pangeaware',
        type: 'User',
        site_admin: false,
      },
      comments: 1,
      review_comments: 16,
      maintainer_can_modify: false,
      commits: 28,
      additions: 2718,
      deletions: 2283,
      changed_files: 21,
    },
  ];
}

function getPullRequestReviewsForPR3() {
  return [
    {
      id: 368949349,
      node_id: 'MDE3OlB1bGxSZXF1ZXN0UmV2aWV3MzY4OTQ5MzQ5',
      user: {
        login: 'pangeaware',
        id: 1045023,
        node_id: 'MDQ6VXNlcjEwNDUwMjM=',
        avatar_url: 'https://avatars.githubusercontent.com/u/1045023?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/pangeaware',
        html_url: 'https://github.com/pangeaware',
        type: 'User',
        site_admin: false,
      },
      body: 'LGTM',
      state: 'COMMENTED',
      html_url:
        'https://github.com/Semalab/phoenix/pull/3#pullrequestreview-368949349',
      pull_request_url: 'https://api.github.com/repos/Semalab/phoenix/pulls/3',
      author_association: 'NONE',
      submitted_at: '2020-03-04T16:51:57Z',
      commit_id: 'ed9af2830a41266bbacc8f3bc18cd38ccb6f5257',
    },
    {
      id: 368961965,
      node_id: 'MDE3OlB1bGxSZXF1ZXN0UmV2aWV3MzY4OTYxOTY1',
      user: {
        login: 'jrock17',
        id: 1270524,
        node_id: 'MDQ6VXNlcjEyNzA1MjQ=',
        avatar_url:
          'https://avatars.githubusercontent.com/u/1270524?u=0f267a0eebb8fa1d3ac7c72265e47639f8d3963a&v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/jrock17',
        html_url: 'https://github.com/jrock17',
        type: 'User',
        site_admin: false,
      },
      body: '', // Make sure we ignore this
      state: 'COMMENTED',
      html_url:
        'https://github.com/Semalab/phoenix/pull/3#pullrequestreview-368961965',
      pull_request_url: 'https://api.github.com/repos/Semalab/phoenix/pulls/3',
      author_association: 'CONTRIBUTOR',
      submitted_at: '2020-03-04T17:07:52Z',
      commit_id: '41920e77176543a9bd2afe1a54ba7839ff3f7f4f',
    },
  ];
}

function getPullRequestReviewsForPR4() {
  return [
    {
      id: 268949344,
      node_id: 'bDE3OlB1bGxSZXF1ZXN0UmV2aWV3MzY4OTQ5MzQ2',
      user: {
        login: 'pangeaware',
        id: 1045023,
        node_id: 'MDQ6VXNlcjEwNDUwMjM=',
        avatar_url: 'https://avatars.githubusercontent.com/u/1045023?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/pangeaware',
        html_url: 'https://github.com/pangeaware',
        type: 'User',
        site_admin: false,
      },
      body: 'LGTM on PR 4',
      state: 'COMMENTED',
      html_url:
        'https://github.com/Semalab/phoenix/pull/4#pullrequestreview-368949349',
      pull_request_url: 'https://api.github.com/repos/Semalab/phoenix/pulls/4',
      author_association: 'NONE',
      submitted_at: '2020-03-04T16:51:57Z',
      commit_id: 'ed9af2830a41266bbacc8f3bc18cd38ccb6f5257',
    },
  ];
}
