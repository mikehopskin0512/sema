import assert from 'assert';
import { differenceInMinutes } from 'date-fns';
import sample from 'lodash/sample';
import nock from 'nock';
import mongoose from 'mongoose';
import resetNocks, { setDefaultNocks } from '../../test/nocks';
import createUser from '../../test/helpers/userHelper';
import * as userService from '../users/userService';
import { create as createSmartComment } from '../comments/smartComments/smartCommentService';
import {
  create as createRepository,
  startSync,
} from '../repositories/repositoryService';
import Repository from '../repositories/repositoryModel';
import SmartComment from '../comments/smartComments/smartCommentModel';
import User from '../users/userModel';
import handler from './importRepositoryQueue';
import { resetRateLimitTracking } from './repoSyncService';
import { rateLimitRemaining } from '../../test/nocks/github';

const {
  Types: { ObjectId },
} = mongoose;

describe('Import Repository Queue', () => {
  let user;
  let repository;

  beforeAll(async () => {
    user = await createUser();
  });

  describe('newly added repository', () => {
    let comments;

    beforeAll(async () => {
      resetNocks();
      nockPhoenixInstallation();
      await Repository.deleteMany();
      await SmartComment.deleteMany();
    });

    beforeAll(async () => {
      repository = await createRepository({
        name: 'phoenix',
        type: 'github',
        id: '237888452',
        cloneUrl: 'https://github.com/Semalab/phoenix',
      });
      await startSync({ repository, user });
    });

    it('should have sync status "queued"', () => {
      expect(repository.sync.status).toBe('queued');
    });

    describe('processing queue', () => {
      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, getFirstPageOfPullRequestComments(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=2&sort=created&per_page=100&direction=desc>; rel="next", <https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=2&sort=created&per_page=100&direction=desc>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 2, per_page: 100 })
          .reply(200, getSecondPageOfPullRequestComments());
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, getFirstPageOfIssueComments(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/issues/comments?page=2&sort=created&per_page=100&direction=desc>; rel="next", <https://api.github.com/repos/Semalab/phoenix/issues/comments?page=2&sort=created&per_page=100&direction=desc>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 2, per_page: 100 })
          .reply(200, getSecondPageOfIssueComments());
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls')
          .query({
            sort: 'created',
            direction: 'desc',
            page: 1,
            state: 'all',
            per_page: 100,
          })
          .reply(200, getFirstPageOfPullRequests(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls?page=2&sort=created&direction=desc&per_page=100&state=all>; rel="next", <https://api.github.com/repos/Semalab/phoenix/pulls?page=2&sort=created&direction=desc&per_page=100&state=all>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/pulls')
          .query({
            sort: 'created',
            direction: 'desc',
            page: 2,
            state: 'all',
            per_page: 100,
          })
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
        comments = await SmartComment.find({ repositoryId: repository });
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

        it('should have source origin "sync"', () => {
          expect(comment.source.origin).toBe('sync');
        });

        it('should have comment body', () => {
          expect(comment.comment).toBe(
            '@jrock17 i know this is the logic you were referring to yesterday... looks awesome and elegant'
          );
        });

        it('should have reaction', () => {
          expect(comment.reaction).toEqualID('607f0d1ed7f45b000ec2ed70');
        });

        it('should have a tag', () => {
          expect(comment.tags.length).toBe(0);
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

        it('should have source origin "sync"', () => {
          expect(comment.source.origin).toBe('sync');
        });

        it('should have comment body', () => {
          expect(comment.comment).toBe('LGTM');
        });

        it('should have the "No reaction" reaction', () => {
          expect(comment.reaction).toEqualID('607f0d1ed7f45b000ec2ed70');
        });

        it('should have no tags', () => {
          expect(comment.tags).toHaveLength(0);
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

          it('should store the pull request number', () => {
            expect(githubMetadata.pull_number).toBe('3');
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

        it('should have source origin "sync"', () => {
          expect(comment.source.origin).toBe('sync');
        });

        it('should have comment body', () => {
          expect(comment.comment).toBe('Test');
        });

        it('should have no tags', () => {
          expect(comment.tags).toHaveLength(0);
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

        it('should update repoStats', () => {
          expect(repository.repoStats.smartCodeReviews).toBe(1);
          expect(repository.repoStats.smartComments).toBe(7);
          expect(repository.repoStats.smartCommenters).toBe(3);
          expect(repository.repoStats.semaUsers).toBe(3);
          expect(repository.repoStats.tags).toHaveLength(7);
          expect(repository.repoStats.reactions).toHaveLength(7);
        });

        it('should have sync completed at timestamp', () => {
          expect(repository.sync.completedAt).toBeCloseToDate(new Date());
        });

        it('should have last updated timestamp for polling', () => {
          const { progress } = repository.sync;
          expect(progress.issueComment.lastUpdatedAt).toEqual(
            new Date('2022-05-18T13:21:37.000Z')
          );
          expect(progress.pullRequestComment.lastUpdatedAt).toEqual(
            new Date('2020-12-17T20:30:14.000Z')
          );
          expect(progress.pullRequestReview.lastUpdatedAt).toEqual(
            new Date('2020-03-04T16:51:57.000Z')
          );
        });
      });
    });

    describe('processing queue again', () => {
      beforeAll(() => {
        resetNocks();
        nockPhoenixInstallation();
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, getFirstPageOfPullRequestComments(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=2&sort=created&per_page=100&direction=desc>; rel="next", <https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=2&sort=created&per_page=100&direction=desc>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 2, per_page: 100 })
          .reply(200, getSecondPageOfPullRequestComments());
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, getFirstPageOfIssueComments(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/issues/comments?page=2&sort=created&per_page=100&direction=desc>; rel="next", <https://api.github.com/repos/Semalab/phoenix/issues/comments?page=2&sort=created&per_page=100&direction=desc>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 2, per_page: 100 })
          .reply(200, getSecondPageOfIssueComments());
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls')
          .query({
            sort: 'created',
            direction: 'desc',
            page: 1,
            state: 'all',
            per_page: 100,
          })
          .reply(200, getFirstPageOfPullRequests(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls?page=2&sort=created&direction=desc&per_page=100&state=all>; rel="next", <https://api.github.com/repos/Semalab/phoenix/pulls?page=2&sort=created&direction=desc&per_page=100&state=all>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/pulls')
          .query({
            sort: 'created',
            direction: 'desc',
            page: 2,
            state: 'all',
            per_page: 100,
          })
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
        comments = await SmartComment.find({ repositoryId: repository });
      });

      it('should import seven comments', () => {
        expect(comments.length).toBe(7);
      });
    });

    describe('when syncing pull request comments fails half-way through', () => {
      let handlerError;

      beforeAll(() => {
        resetNocks();
        nockPhoenixInstallation();
      });

      beforeAll(async () => {
        repository.sync = {};
        await repository.save();
        await SmartComment.deleteMany({});
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, getFirstPageOfPullRequestComments(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=2&sort=created&per_page=100&direction=desc>; rel="next", <https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=2&sort=created&per_page=100&direction=desc>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 2, per_page: 100 })
          .reply(500, 'GitHub error');
      });

      beforeAll(() => {
        // Only test resuming of pull request comments.
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, [])
          .get('/repos/Semalab/phoenix/pulls')
          .query({
            sort: 'created',
            direction: 'desc',
            page: 1,
            state: 'all',
            per_page: 100,
          })
          .reply(200, []);
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
        comments = await SmartComment.find({ repositoryId: repository });
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
          nockPhoenixInstallation();
        });

        beforeAll(() => {
          // Set the first page to always fail. This is to
          // ensure that the job can pick up pagination
          // where it left off.
          nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/pulls/comments')
            .query({
              sort: 'created',
              direction: 'desc',
              page: 1,
              per_page: 100,
            })
            .reply(500, 'GitHub error')
            .get('/repos/Semalab/phoenix/pulls/comments')
            .query({
              sort: 'created',
              direction: 'desc',
              page: 2,
              per_page: 100,
            })
            .reply(200, () => getSecondPageOfPullRequestComments());
        });

        beforeAll(() => {
          // Only test resuming of pull request comments.
          nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/issues/comments')
            .query({
              sort: 'created',
              direction: 'desc',
              page: 1,
              per_page: 100,
            })
            .reply(200, [])
            .get('/repos/Semalab/phoenix/pulls')
            .query({
              sort: 'created',
              direction: 'desc',
              page: 1,
              state: 'all',
              per_page: 100,
            })
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
          comments = await SmartComment.find({ repositoryId: repository });
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
        nockPhoenixInstallation();
      });

      beforeAll(async () => {
        repository.sync = {};
        await repository.save();
        await SmartComment.deleteMany({});
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, getFirstPageOfIssueComments(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/issues/comments?sort=created&direction=desc&page=2&per_page=100>; rel="next", <https://api.github.com/repos/Semalab/phoenix/issues/comments?sort=created&direction=desc&page=2&per_page=100>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 2, per_page: 100 })
          .reply(500, 'GitHub Error');
      });

      beforeAll(() => {
        // Only test resuming of issue comments.
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, [])
          .get('/repos/Semalab/phoenix/pulls')
          .query({
            sort: 'created',
            direction: 'desc',
            page: 1,
            state: 'all',
            per_page: 100,
          })
          .reply(200, []);
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
        comments = await SmartComment.find({ repositoryId: repository });
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
            .query({
              sort: 'created',
              direction: 'desc',
              page: 1,
              per_page: 100,
            })
            .reply(500, 'GitHub error')
            .get('/repos/Semalab/phoenix/issues/comments')
            .query({
              sort: 'created',
              direction: 'desc',
              page: 2,
              per_page: 100,
            })
            .reply(200, getSecondPageOfIssueComments());
        });

        beforeAll(() => {
          // Only test resuming of issue comments.
          nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/pulls/comments')
            .query({
              sort: 'created',
              direction: 'desc',
              page: 1,
              per_page: 100,
            })
            .reply(200, [])
            .get('/repos/Semalab/phoenix/pulls')
            .query({
              sort: 'created',
              direction: 'desc',
              page: 1,
              state: 'all',
              per_page: 100,
            })
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
          comments = await SmartComment.find({ repositoryId: repository });
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
            .query({
              sort: 'created',
              direction: 'desc',
              page: 1,
              per_page: 100,
            })
            .reply(200, [])
            .get('/repos/Semalab/phoenix/pulls')
            .query({
              sort: 'created',
              direction: 'desc',
              page: 1,
              state: 'all',
              per_page: 100,
            })
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
        nockPhoenixInstallation();
      });

      beforeAll(async () => {
        repository.sync = {};
        await repository.save();
        await SmartComment.deleteMany({});
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls')
          .query({
            sort: 'created',
            direction: 'desc',
            page: 1,
            state: 'all',
            per_page: 100,
          })
          .reply(200, getFirstPageOfPullRequests(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls?page=2&sort=created&direction=desc&per_page=100&state=all>; rel="next", <https://api.github.com/repos/Semalab/phoenix/pulls?page=2&sort=created&direction=desc&per_page=100&state=all>; rel="last"',
          })
          .get('/repos/Semalab/phoenix/pulls')
          .query({
            sort: 'created',
            direction: 'desc',
            page: 2,
            state: 'all',
            per_page: 100,
          })
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
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, [])
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, []);
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
        comments = await SmartComment.find({ repositoryId: repository });
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
            .query({
              sort: 'created',
              direction: 'desc',
              page: 1,
              state: 'all',
              per_page: 100,
            })
            .reply(500, 'GitHub error')
            .get('/repos/Semalab/phoenix/pulls')
            .query({
              sort: 'created',
              direction: 'desc',
              page: 2,
              state: 'all',
              per_page: 100,
            })
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
            .query({
              sort: 'created',
              direction: 'desc',
              page: 1,
              per_page: 100,
            })
            .reply(200, [])
            .get('/repos/Semalab/phoenix/issues/comments')
            .query({
              sort: 'created',
              direction: 'desc',
              page: 1,
              per_page: 100,
            })
            .reply(200, []);
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
          comments = await SmartComment.find({ repositoryId: repository });
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
            .query({
              sort: 'created',
              direction: 'desc',
              page: 1,
              per_page: 100,
            })
            .reply(200, [])
            .get('/repos/Semalab/phoenix/pulls/comments')
            .query({
              sort: 'created',
              direction: 'desc',
              page: 1,
              per_page: 100,
            })
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

    describe('on error', () => {
      let handlerError;

      beforeAll(() => {
        resetNocks();
        nockPhoenixInstallation();
      });

      beforeAll(async () => {
        repository.sync = {};
        await repository.save();
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query(() => true)
          .reply(404, {
            message: 'Not Found',
          })
          .get('/repos/Semalab/phoenix/issues/comments')
          .query(() => true)
          .reply(404, {
            message: 'Not Found',
          })
          .get('/repos/Semalab/phoenix/pulls')
          .query(() => true)
          .reply(404, {
            message: 'Not Found',
          });
      });

      beforeAll(async () => {
        try {
          await handler({ id: repository.id });
        } catch (error) {
          handlerError = error;
        }
      });

      it('should fail the job', () => {
        expect(handlerError.message).toBe('Not Found');
      });

      describe('repository', () => {
        beforeAll(async () => {
          repository = await Repository.findById(repository._id);
        });

        it('should have sync status "errored"', () => {
          expect(repository.sync.status).toBe('errored');
        });

        it('should have sync errored at timestamp', () => {
          expect(repository.sync.erroredAt).toBeCloseToDate(new Date());
        });

        it('should have sync error message', () => {
          expect(repository.sync.error).toBe('Not Found');
        });
      });

      describe('processing again successfully', () => {
        beforeAll(() => {
          nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/pulls/comments')
            .query(() => true)
            .reply(200, [])
            .get('/repos/Semalab/phoenix/issues/comments')
            .query(() => true)
            .reply(200, [])
            .get('/repos/Semalab/phoenix/pulls')
            .query(() => true)
            .reply(200, []);
        });

        beforeAll(async () => {
          await handler({ id: repository.id });
        });

        describe('repository', () => {
          beforeAll(async () => {
            repository = await Repository.findById(repository._id);
          });

          it('should have sync status "completed"', () => {
            expect(repository.sync.status).toBe('completed');
          });

          it('should not have sync errored at timestamp', () => {
            expect(repository.sync.erroredAt).toBeFalsy();
          });

          it('should not have sync error message', () => {
            expect(repository.sync.error).toBeFalsy();
          });
        });
      });
    });

    describe('importing a comment created using the Chrome extension', () => {
      beforeAll(async () => {
        resetNocks();
        nockPhoenixInstallation();
        await SmartComment.deleteMany();
        repository.sync = {};
        await repository.save();
      });

      beforeAll(() => {
        const firstComment = getFirstPageOfPullRequestComments()[0];
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, [
            {
              ...firstComment,
              // Intentionally including ":throphy:" here
              // to verify that we get the reaction from the
              // right place.
              body: 'LGTM :trophy:\r\n\r\n__\r\n[![sema-logo](https://app.semasoftware.com/img/sema-tray-logo.svg)](http://semasoftware.com/gh) &nbsp;**Summary:** :ok_hand: This code looks good&nbsp; | &nbsp;**Tags:** Fault-tolerant, Maintainable\r\n',
            },
          ]);
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
        comments = await SmartComment.find({ repositoryId: repository });
      });

      describe('imported comment', () => {
        let comment;

        beforeAll(() => {
          comment = comments.find(
            (c) => c.githubMetadata.type === 'pullRequestComment'
          );
        });

        it('should trim the Sema signature', () => {
          expect(comment.comment).toBe('LGTM :trophy:');
        });

        it('should have tags', () => {
          expect(comment.tags.map((id) => id.toString())).toEqual([
            '607f0594ab1bc1aecbe2ce55',
            '607f0594ab1bc1aecbe2ce57',
          ]);
        });

        it('should have reaction', () => {
          expect(comment.reaction).toEqualID('607f0d1ed7f45b000ec2ed72');
        });
      });
    });
  });

  describe('when another comment exists without ID', () => {
    let comment;

    describe('existing comment within a minute of the GitHub comment', () => {
      beforeAll(async () => {
        resetNocks();
        nockPhoenixInstallation();
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
              // At the time of writing, githubMetadata.user.id
              // contains bogus information. Comparing by login for now.
              // https://semasoftware.slack.com/archives/C01MXTW3DRS/p1653602721759599
              // This doesn't match the user ID for pangeaware
              // on purpose, to ensure the code matches by login.
              id: '2045024',
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
          cloneUrl: 'https://github.com/Semalab/phoenix',
        });
        await startSync({ repository, user });
        nockPhoenixInstallation();
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, getFirstPageOfPullRequestComments().slice(0, 1))
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, [])
          .get('/repos/Semalab/phoenix/pulls')
          .query({
            sort: 'created',
            direction: 'desc',
            page: 1,
            state: 'all',
            per_page: 100,
          })
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

    describe('GitHub comment is much older than the existing comment', () => {
      beforeAll(async () => {
        resetNocks();
        nockPhoenixInstallation();
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
            // created_at intentionally much older than the one
            // provided by the API.
            created_at: '2020-01-01T10:00:00Z',
            updated_at: '2020-12-17T20:30:14Z',
            user: {
              // At the time of writing, githubMetadata.user.id
              // contains bogus information. Comparing by login for now.
              // https://semasoftware.slack.com/archives/C01MXTW3DRS/p1653602721759599
              // This doesn't match the user ID for pangeaware
              // on purpose, to ensure the code matches by login.
              id: '2045024',
              login: 'pangeaware',
            },
            requester: 'jrock17',
          },
        });
        assert.equal(await SmartComment.countDocuments(), 1);
      });

      beforeAll(async () => {
        repository = await createRepository({
          name: 'phoenix',
          type: 'github',
          id: '237888452',
          cloneUrl: 'https://github.com/Semalab/phoenix',
        });
        await startSync({ repository, user });
        nockPhoenixInstallation();
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, getFirstPageOfPullRequestComments().slice(0, 1))
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, [])
          .get('/repos/Semalab/phoenix/pulls')
          .query({
            sort: 'created',
            direction: 'desc',
            page: 1,
            state: 'all',
            per_page: 100,
          })
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

      it('should create a new smart comment', async () => {
        const count = await SmartComment.countDocuments();
        expect(count).toBe(2);
      });

      it('should not match existing comment', async () => {
        comment = await SmartComment.findById(comment._id);
        expect(comment.source.id).toBeFalsy();
      });
    });

    describe('two existing comments created close in time', () => {
      let comment1;
      let comment2;

      beforeAll(async () => {
        resetNocks();
        nockPhoenixInstallation();
        await Repository.deleteMany();
        await SmartComment.deleteMany();
      });

      beforeAll(async () => {
        comment1 = await createSmartComment({
          comment: '@jrock17 This looks great!',
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
            created_at: '2020-12-17T18:35:30Z',
            updated_at: '2020-12-17T20:30:14Z',
            user: {
              // At the time of writing, githubMetadata.user.id
              // contains bogus information. Comparing by login for now.
              // https://semasoftware.slack.com/archives/C01MXTW3DRS/p1653602721759599
              // This doesn't match the user ID for pangeaware
              // on purpose, to ensure the code matches by login.
              id: '2045024',
              login: 'pangeaware',
            },
            requester: 'jrock17',
          },
        });
        comment2 = await createSmartComment({
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
            created_at: '2020-12-17T18:35:00Z',
            updated_at: '2020-12-17T20:30:14Z',
            user: {
              // At the time of writing, githubMetadata.user.id
              // contains bogus information. Comparing by login for now.
              // https://semasoftware.slack.com/archives/C01MXTW3DRS/p1653602721759599
              // This doesn't match the user ID for pangeaware
              // on purpose, to ensure the code matches by login.
              id: '2045024',
              login: 'pangeaware',
            },
            requester: 'jrock17',
          },
        });
        assert.equal(await SmartComment.countDocuments(), 2);
        const difference = differenceInMinutes(
          comment1.githubMetadata.created_at,
          comment2.githubMetadata.created_at
        );
        assert.equal(difference, 0);
      });

      beforeAll(async () => {
        repository = await createRepository({
          name: 'phoenix',
          type: 'github',
          id: '237888452',
          cloneUrl: 'https://github.com/Semalab/phoenix',
        });
        await startSync({ repository, user });
        nockPhoenixInstallation();
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, getFirstPageOfPullRequestComments().slice(0, 1))
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, [])
          .get('/repos/Semalab/phoenix/pulls')
          .query({
            sort: 'created',
            direction: 'desc',
            page: 1,
            state: 'all',
            per_page: 100,
          })
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

      it('should match with the right comment', async () => {
        comment1 = await SmartComment.findById(comment1._id);
        expect(comment1.source.id).toBeFalsy();

        comment2 = await SmartComment.findById(comment2._id);
        expect(comment2.source.id).toBe('pullRequestComment:545313646');
      });

      describe('run again', () => {
        beforeAll(async () => {
          repository.sync = {};
          await repository.save();
        });

        beforeAll(() => {
          nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/pulls/comments')
            .query({
              sort: 'created',
              direction: 'desc',
              page: 1,
              per_page: 100,
            })
            .reply(200, getFirstPageOfPullRequestComments().slice(0, 1))
            .get('/repos/Semalab/phoenix/issues/comments')
            .query({
              sort: 'created',
              direction: 'desc',
              page: 1,
              per_page: 100,
            })
            .reply(200, [])
            .get('/repos/Semalab/phoenix/pulls')
            .query({
              sort: 'created',
              direction: 'desc',
              page: 1,
              state: 'all',
              per_page: 100,
            })
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

        it('should not match with another comment', async () => {
          comment1 = await SmartComment.findById(comment1._id);
          expect(comment1.source.id).toBeFalsy();

          comment2 = await SmartComment.findById(comment2._id);
          expect(comment2.source.id).toBe('pullRequestComment:545313646');
        });
      });
    });

    describe('two existing comments created close in time, with same text', () => {
      let comment1;
      let comment2;

      beforeAll(async () => {
        resetNocks();
        nockPhoenixInstallation();
        await Repository.deleteMany();
        await SmartComment.deleteMany();
      });

      beforeAll(async () => {
        comment1 = await createSmartComment({
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
            // This timestamp is 10 seconds after the one coming from the API.
            created_at: '2020-12-17T18:35:50Z',
            updated_at: '2020-12-17T20:30:14Z',
            user: {
              // At the time of writing, githubMetadata.user.id
              // contains bogus information. Comparing by login for now.
              // https://semasoftware.slack.com/archives/C01MXTW3DRS/p1653602721759599
              // This doesn't match the user ID for pangeaware
              // on purpose, to ensure the code matches by login.
              id: '2045024',
              login: 'pangeaware',
            },
            requester: 'jrock17',
          },
        });
        comment2 = await createSmartComment({
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
            created_at: '2020-12-17T18:35:41Z',
            updated_at: '2020-12-17T20:30:14Z',
            user: {
              // At the time of writing, githubMetadata.user.id
              // contains bogus information. Comparing by login for now.
              // https://semasoftware.slack.com/archives/C01MXTW3DRS/p1653602721759599
              // This doesn't match the user ID for pangeaware
              // on purpose, to ensure the code matches by login.
              id: '2045024',
              login: 'pangeaware',
            },
            requester: 'jrock17',
          },
        });
        assert.equal(await SmartComment.countDocuments(), 2);
        const difference = differenceInMinutes(
          comment1.githubMetadata.created_at,
          comment2.githubMetadata.created_at
        );
        assert.equal(difference, 0);
      });

      beforeAll(async () => {
        repository = await createRepository({
          name: 'phoenix',
          type: 'github',
          id: '237888452',
          cloneUrl: 'https://github.com/Semalab/phoenix',
        });
        await startSync({ repository, user });
        nockPhoenixInstallation();
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, getFirstPageOfPullRequestComments().slice(0, 1))
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, [])
          .get('/repos/Semalab/phoenix/pulls')
          .query({
            sort: 'created',
            direction: 'desc',
            page: 1,
            state: 'all',
            per_page: 100,
          })
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

      it('should match with the right comment', async () => {
        comment1 = await SmartComment.findById(comment1._id);
        expect(comment1.source.id).toBeFalsy();

        comment2 = await SmartComment.findById(comment2._id);
        expect(comment2.source.id).toBe('pullRequestComment:545313646');
      });
    });

    describe('two existing comments created close in time, with same text, different PR', () => {
      let comment1;
      let comment2;

      beforeAll(async () => {
        resetNocks();
        nockPhoenixInstallation();
        await Repository.deleteMany();
        await SmartComment.deleteMany();
      });

      beforeAll(async () => {
        comment1 = await createSmartComment({
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
            pull_number: '3',
            url: 'https://github.com/Semalab/phoenix',
            // This timestamp is 10 seconds after the one coming from the API.
            created_at: '2020-12-17T18:35:50Z',
            updated_at: '2020-12-17T20:30:14Z',
            user: {
              id: '1045023',
              login: 'pangeaware',
            },
            requester: 'jrock17',
          },
        });
        comment2 = await createSmartComment({
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
            created_at: '2020-12-17T18:35:41Z',
            updated_at: '2020-12-17T20:30:14Z',
            pull_number: '4',
            user: {
              id: '1045023',
              login: 'pangeaware',
            },
            requester: 'jrock17',
          },
        });
        assert.equal(await SmartComment.countDocuments(), 2);
        const difference = differenceInMinutes(
          comment1.githubMetadata.created_at,
          comment2.githubMetadata.created_at
        );
        assert.equal(difference, 0);
      });

      beforeAll(async () => {
        repository = await createRepository({
          name: 'phoenix',
          type: 'github',
          id: '237888452',
          cloneUrl: 'https://github.com/Semalab/phoenix',
        });
        await startSync({ repository, user });
        nockPhoenixInstallation();
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, getFirstPageOfPullRequestComments().slice(0, 1))
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, [])
          .get('/repos/Semalab/phoenix/pulls')
          .query({
            sort: 'created',
            direction: 'desc',
            page: 1,
            state: 'all',
            per_page: 100,
          })
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

      it('should match with the right comment', async () => {
        comment1 = await SmartComment.findById(comment1._id);
        expect(comment1.source.id).toBe('pullRequestComment:545313646');

        comment2 = await SmartComment.findById(comment2._id);
        expect(comment2.source.id).toBeFalsy();
      });
    });
  });

  describe('when comment author is a user of Sema', () => {
    let comment;
    let pangeawareUser;

    beforeAll(async () => {
      resetNocks();
      nockPhoenixInstallation();
      await SmartComment.deleteMany();
      await User.deleteMany();
    });

    beforeAll(async () => {
      pangeawareUser = await userService.create({
        username: 'Pangeaware',
        password: 's3cr3t',
        firstName: 'Chris',
        lastName: 'Smith',
        identities: [
          {
            email: 'pangeaware@example.com',
            id: '1045023',
            provider: 'github',
            repositories: [],
            username: 'pangeaware',
          },
        ],
        terms: true,
      });
    });

    describe('comment is new', () => {
      beforeAll(async () => {
        await SmartComment.deleteMany();
      });

      beforeAll(async () => {
        repository = await createRepository({
          name: 'phoenix',
          type: 'github',
          id: '237888452',
          cloneUrl: 'https://github.com/Semalab/phoenix',
        });
        await startSync({ repository, user });
        nockPhoenixInstallation();
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, getFirstPageOfPullRequestComments().slice(0, 1))
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, [])
          .get('/repos/Semalab/phoenix/pulls')
          .query({
            sort: 'created',
            direction: 'desc',
            page: 1,
            state: 'all',
            per_page: 100,
          })
          .reply(200, []);
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/3')
          .reply(200, getPullRequestDetailPR3());
      });

      beforeAll(async () => {
        await handler({ id: repository.id });
        comment = await SmartComment.findOne().populate('userId');
      });

      it('should reference the Sema user', () => {
        expect(comment.userId).toEqualID(pangeawareUser);
      });
    });

    describe('when comment exists in the database', () => {
      beforeAll(async () => {
        await SmartComment.deleteMany();
      });

      beforeAll(async () => {
        comment = await createSmartComment({
          comment:
            '@jrock17 this function feels like it should live somewhere else as well with repo code.',
          location: 'files changed',
          suggestedComments: [],
          reaction: '607f0d1ed7f45b000ec2ed71',
          tags: [],
          // Bogus user ID, just to pass validation.
          userId: user.id,
          githubMetadata: {
            commentId: null,
            filename: null,
            repo: 'phoenix',
            repo_id: '237888452',
            url: 'https://github.com/Semalab/phoenix',
            created_at: '2020-12-17T18:35:40Z',
            updated_at: '2020-12-17T20:30:14Z',
            user: {
              // At the time of writing, githubMetadata.user.id
              // contains bogus information. Comparing by login for now.
              // https://semasoftware.slack.com/archives/C01MXTW3DRS/p1653602721759599
              // This doesn't match the user ID for pangeaware
              // on purpose, to ensure the code matches by login.
              id: '2045024',
              login: 'pangeaware',
            },
            requester: 'jrock17',
          },
        });
        // Blank user ID, matches state of database on June 2022.
        await comment.updateOne({ $set: { userId: null } });
      });

      beforeAll(async () => {
        repository = await createRepository({
          name: 'phoenix',
          type: 'github',
          id: '237888452',
          cloneUrl: 'https://github.com/Semalab/phoenix',
        });
        await startSync({ repository, user });
        nockPhoenixInstallation();
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, getFirstPageOfPullRequestComments().slice(0, 1))
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, [])
          .get('/repos/Semalab/phoenix/pulls')
          .query({
            sort: 'created',
            direction: 'desc',
            page: 1,
            state: 'all',
            per_page: 100,
          })
          .reply(200, []);
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/3')
          .reply(200, getPullRequestDetailPR3());
      });

      beforeAll(async () => {
        await handler({ id: repository.id });
        comment = await SmartComment.findById(comment._id);
      });

      it('should match with existing comment', async () => {
        const count = await SmartComment.countDocuments();
        expect(count).toBe(1);
        expect(comment.source.id).toBe('pullRequestComment:545313646');
      });

      it('should reference the Sema user', () => {
        expect(comment.userId).toEqualID(pangeawareUser);
      });
    });
  });

  describe('when comment author is not a user of Sema', () => {
    let comment;

    beforeAll(async () => {
      await User.deleteMany();
    });

    beforeAll(async () => {
      repository = await createRepository({
        name: 'phoenix',
        type: 'github',
        id: '237888452',
        cloneUrl: 'https://github.com/Semalab/phoenix',
      });
      await startSync({ repository, user });
      nockPhoenixInstallation();
    });

    describe('comment is new', () => {
      beforeAll(async () => {
        resetNocks();
        nockPhoenixInstallation();
        await SmartComment.deleteMany();
        repository.sync = {};
        await repository.save();
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, getFirstPageOfPullRequestComments().slice(1, 2))
          .get('/repos/Semalab/phoenix/issues/comments')
          .query(() => true)
          .reply(200, [])
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
        comment = await SmartComment.findOne().populate('userId');
        user = comment.userId;
      });

      describe('ghost user', () => {
        it('should have username', () => {
          expect(user.username).toBe('jrock17');
        });

        it('should have handle', () => {
          expect(user.handle).toBe('jrock17');
        });

        it('should be inactive', () => {
          expect(user.isActive).toBe(false);
        });

        it('should have GitHub identity', () => {
          const identity = user.identities[0];
          expect(identity.provider).toBe('github');
          expect(identity.id).toBe('1270524');
          expect(identity.username).toBe('jrock17');
          expect(identity.avatarUrl).toBe(
            'https://avatars.githubusercontent.com/u/1270524?v=4'
          );
        });

        it('should have origin "sync"', () => {
          expect(user.origin).toBe('sync');
        });

        it('should have avatar', () => {
          expect(user.avatarUrl).toBe(
            'https://avatars.githubusercontent.com/u/1270524?v=4'
          );
        });

        it('should not have accepted terms', () => {
          expect(user.termsAcceptedAt).toBeFalsy();
        });

        it('should not be onboarded', () => {
          expect(user.isOnboarded).toBeFalsy();
        });

        it('should not have last login timestamp', () => {
          expect(user.lastLogin).toBeFalsy();
        });
      });
    });

    describe('when comment exists in the database', () => {
      beforeAll(async () => {
        resetNocks();
        nockPhoenixInstallation();
        await SmartComment.deleteMany();
        await User.deleteMany();
        repository.sync = {};
        await repository.save();
      });

      beforeAll(async () => {
        comment = await createSmartComment({
          comment:
            'Renamed to `completedAt` since that mirrors the timestamp vars like `createdAt`',
          location: 'files changed',
          suggestedComments: [],
          reaction: '607f0d1ed7f45b000ec2ed71',
          tags: [],
          // Bogus user ID, just to pass validation.
          userId: new ObjectId(),
          githubMetadata: {
            commentId: null,
            filename: null,
            repo: 'phoenix',
            repo_id: '237888452',
            url: 'https://github.com/Semalab/phoenix',
            created_at: '2020-12-17T18:41:25Z',
            updated_at: '2020-12-17T20:30:14Z',
            user: {
              id: '2045024',
              login: 'jrock17',
            },
            requester: 'pangeaware',
          },
        });
        // Blank user ID, matches state of database on June 2022.
        await comment.updateOne({ $set: { userId: null } });
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
          .reply(200, getFirstPageOfPullRequestComments().slice(1, 2))
          .get('/repos/Semalab/phoenix/issues/comments')
          .query(() => true)
          .reply(200, [])
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
        comment = await SmartComment.findOne().populate('userId');
        user = comment.userId;
      });

      it('should match with existing comment', async () => {
        const count = await SmartComment.countDocuments();
        expect(count).toBe(1);
        expect(comment.source.id).toBe('pullRequestComment:545317389');
      });

      describe('ghost user', () => {
        it('should have username', () => {
          expect(user.username).toBe('jrock17');
        });

        it('should have handle', () => {
          expect(user.handle).toBe('jrock17');
        });

        it('should be inactive', () => {
          expect(user.isActive).toBe(false);
        });

        it('should have GitHub identity', () => {
          const identity = user.identities[0];
          expect(identity.provider).toBe('github');
          expect(identity.id).toBe('1270524');
          expect(identity.username).toBe('jrock17');
          expect(identity.avatarUrl).toBe(
            'https://avatars.githubusercontent.com/u/1270524?v=4'
          );
        });

        it('should have origin "sync"', () => {
          expect(user.origin).toBe('sync');
        });

        it('should have avatar', () => {
          expect(user.avatarUrl).toBe(
            'https://avatars.githubusercontent.com/u/1270524?v=4'
          );
        });

        it('should not have accepted terms', () => {
          expect(user.termsAcceptedAt).toBeFalsy();
        });

        it('should not be onboarded', () => {
          expect(user.isOnboarded).toBeFalsy();
        });

        it('should not have last login timestamp', () => {
          expect(user.lastLogin).toBeFalsy();
        });
      });
    });
  });

  describe('importing a comment that quotes a Sema comment', () => {
    let comments;

    beforeAll(async () => {
      resetNocks();
      nockPhoenixInstallation();
      await SmartComment.deleteMany();
      repository.sync = {};
      await repository.save();
    });

    beforeAll(() => {
      const firstComment = getFirstPageOfPullRequestComments()[0];
      nock('https://api.github.com')
        .get('/repos/Semalab/phoenix/pulls/comments')
        .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
        .reply(200, [
          {
            ...firstComment,
            body:
              '> we decided to not delete invitations\r\n' +
              '> \r\n' +
              '> __ [![sema-logo](https://camo.githubusercontent.com/422032771e9118594bb8e03bc95f4ff1e27acaed89ead04103768eeab458c260/68747470733a2f2f6170702e73656d61736f6674776172652e636f6d2f696d672f73656d612d747261792d6c6f676f2e737667)](https://semasoftware.com/gh)  🛠️ This code needs a fix\r\n' +
              '\r\n' +
              "I actually copied somewhere from existing code but if we don't delete the invitations, the invitations will still be active.\r\n",
          },
        ]);
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
      comments = await SmartComment.find({ repositoryId: repository });
    });

    describe('imported comment', () => {
      let comment;

      beforeAll(() => {
        comment = comments.find(
          (c) => c.githubMetadata.type === 'pullRequestComment'
        );
      });

      it('should not remove the Sema signature', () => {
        expect(comment.comment).toBe(
          '> we decided to not delete invitations\r\n' +
            '> \r\n' +
            '> __ [![sema-logo](https://camo.githubusercontent.com/422032771e9118594bb8e03bc95f4ff1e27acaed89ead04103768eeab458c260/68747470733a2f2f6170702e73656d61736f6674776172652e636f6d2f696d672f73656d612d747261792d6c6f676f2e737667)](https://semasoftware.com/gh)  🛠️ This code needs a fix\r\n' +
            '\r\n' +
            "I actually copied somewhere from existing code but if we don't delete the invitations, the invitations will still be active.\r\n"
        );
      });

      it('should not have tags', () => {
        expect(comment.tags.length).toBe(0);
      });

      it('should have no reaction', () => {
        expect(comment.reaction).toEqualID('607f0d1ed7f45b000ec2ed70');
      });
    });
  });

  describe('when the pull request is no longer found on GitHub', () => {
    let comments;

    beforeAll(async () => {
      resetNocks();
      nockPhoenixInstallation();
      await SmartComment.deleteMany();
      repository.sync = {};
      await repository.save();
    });

    beforeAll(() => {
      const firstComment = getFirstPageOfPullRequestComments()[0];

      nock('https://api.github.com')
        .get('/repos/Semalab/phoenix/pulls/comments')
        .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
        .reply(200, [firstComment]);
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
        .reply(404, { message: 'Not found' });
    });

    beforeAll(async () => {
      await handler({ id: repository.id });
    });

    beforeAll(async () => {
      comments = await SmartComment.find({ repositoryId: repository });
    });

    it('should not import the comment', async () => {
      expect(comments.length).toBe(0);
    });
  });

  describe('public repository', () => {
    let comments;
    let tokenUsedForGitHubAPI;

    beforeAll(async () => {
      await Repository.deleteMany();
      await SmartComment.deleteMany();
    });

    function resetNocksForPublicRepository() {
      resetNocks();
      nock('https://api.github.com')
        .persist()
        .get('/repos/SemaSandbox/astrobee/installation')
        .reply(404);
    }

    beforeAll(async () => {
      resetNocksForPublicRepository();

      repository = await createRepository({
        name: 'astrobee',
        type: 'github',
        id: '391620249',
        cloneUrl: 'https://github.com/SemaSandbox/astrobee',
      });
      await startSync({ repository, user });
    });

    describe('processing queue', () => {
      let previousSample;

      beforeAll(async () => {
        previousSample = await sample.getMockImplementation();
        sample.mockClear();
        sample.mockImplementation((array) => array[1]);
      });

      beforeAll(() => {
        rateLimitRemaining.set(
          'ghs_3X0VGC4uvSelTLk3bbumXa8IycJNAx3I0j2z',
          1000
        );
        rateLimitRemaining.set('ghs_4Z0VGC4uvSelTLk3bbumXa8IycJNAx3I0j3a', 999);
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/SemaSandbox/astrobee/pulls/comments')
          .query(() => true)
          .reply(200, function recordTokenAndReply() {
            [, tokenUsedForGitHubAPI] =
              this.req.headers.authorization[0].split(' ');
            return getPullRequestCommentsForAstrobee();
          });
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/SemaSandbox/astrobee/issues/comments')
          .query(() => true)
          .reply(200, [])
          .get('/repos/SemaSandbox/astrobee/pulls')
          .query(() => true)
          .reply(200, [])
          .get('/repos/SemaSandbox/astrobee/pulls/3')
          .reply(200, getPullRequestDetailAstrobeePR());
      });

      beforeAll(async () => {
        await handler({ id: repository.id });
      });

      beforeAll(async () => {
        comments = await SmartComment.find({ repositoryId: repository });
      });

      it('should import comments', () => {
        expect(comments.length).toBe(1);
      });

      it('should use a random token with quota available', () => {
        expect(sample).toHaveBeenCalled();
        expect(tokenUsedForGitHubAPI).toBe(
          'ghs_4Z0VGC4uvSelTLk3bbumXa8IycJNAx3I0j3a'
        );
      });

      describe('when token runs out of quota', () => {
        beforeAll(async () => {
          resetNocksForPublicRepository();
          await SmartComment.deleteMany({});
          repository.sync = {};
          await repository.save();
        });

        beforeAll(() => {
          rateLimitRemaining.set(
            'ghs_3X0VGC4uvSelTLk3bbumXa8IycJNAx3I0j2z',
            1000
          );
          rateLimitRemaining.set(
            'ghs_4Z0VGC4uvSelTLk3bbumXa8IycJNAx3I0j3a',
            999
          );
        });

        beforeAll(() => {
          nock('https://api.github.com')
            .persist()
            .get('/repos/SemaSandbox/astrobee/pulls/comments')
            .query(() => true)
            .reply(function reply() {
              const authorization = this.req.headers.authorization[0];
              const [, token] = authorization.split(' ');
              tokenUsedForGitHubAPI = token;
              if (token === 'ghs_3X0VGC4uvSelTLk3bbumXa8IycJNAx3I0j2z') {
                rateLimitRemaining.set(
                  'ghs_3X0VGC4uvSelTLk3bbumXa8IycJNAx3I0j2z',
                  0
                );
                return [
                  403,
                  {
                    message:
                      'API rate limit exceeded for installation ID 26434743.',
                  },
                  { 'x-ratelimit-remaining': 0 },
                ];
              }
              if (token === 'ghs_4Z0VGC4uvSelTLk3bbumXa8IycJNAx3I0j3a') {
                return [200, getPullRequestCommentsForAstrobee()];
              }
              return [500];
            })
            .get('/repos/SemaSandbox/astrobee/issues/comments')
            .query(() => true)
            .reply(200, [])
            .get('/repos/SemaSandbox/astrobee/pulls')
            .query(() => true)
            .reply(200, [])
            .get('/repos/SemaSandbox/astrobee/pulls/3')
            .reply(200, getPullRequestDetailAstrobeePR());
        });

        beforeAll(async () => {
          await handler({ id: repository.id });
        });

        beforeAll(async () => {
          comments = await SmartComment.find({ repositoryId: repository });
        });

        it('should import comments', () => {
          expect(comments.length).toBe(1);
        });

        it('should retry using another token', () => {
          expect(tokenUsedForGitHubAPI).toBe(
            'ghs_4Z0VGC4uvSelTLk3bbumXa8IycJNAx3I0j3a'
          );
        });
      });

      describe('when all tokens run out of quota before sync starts', () => {
        beforeAll(async () => {
          resetNocksForPublicRepository();
          await SmartComment.deleteMany({});
          repository.sync = {};
          await repository.save();
        });

        beforeAll(() => {
          rateLimitRemaining.set('ghs_3X0VGC4uvSelTLk3bbumXa8IycJNAx3I0j2z', 0);
          rateLimitRemaining.set('ghs_4Z0VGC4uvSelTLk3bbumXa8IycJNAx3I0j3a', 0);
        });

        beforeAll(() => {
          nock('https://api.github.com')
            .persist()
            .get('/repos/SemaSandbox/astrobee/pulls/comments')
            .query(() => true)
            .reply(200, getFirstPageOfPullRequestComments())
            .get('/repos/SemaSandbox/astrobee/issues/comments')
            .query(() => true)
            .reply(200, [])
            .get('/repos/SemaSandbox/astrobee/pulls')
            .query(() => true)
            .reply(200, [])
            .get('/repos/SemaSandbox/astrobee/pulls/3')
            .reply(200, getPullRequestDetailPR3());
        });

        it('should throw an error', async () => {
          await expect(handler({ id: repository.id })).rejects.toThrow(
            'Ran out of GitHub API quota'
          );
        });

        describe('repository', () => {
          it('should not change sync status', () => {
            expect(repository.sync.status).toBeFalsy();
          });
        });
      });

      describe('when all tokens run out of quota after sync starts', () => {
        beforeAll(async () => {
          resetNocksForPublicRepository();
          await SmartComment.deleteMany({});
          repository.sync = {};
          await repository.save();
        });

        beforeAll(() => {
          rateLimitRemaining.set(
            'ghs_3X0VGC4uvSelTLk3bbumXa8IycJNAx3I0j2z',
            1000
          );
          rateLimitRemaining.set(
            'ghs_4Z0VGC4uvSelTLk3bbumXa8IycJNAx3I0j3a',
            1000
          );
        });

        beforeAll(() => {
          nock('https://api.github.com')
            .persist()
            .get('/repos/SemaSandbox/astrobee/installation')
            .reply(404)
            .get('/repos/SemaSandbox/astrobee/pulls/comments')
            .query(() => true)
            .reply(() => {
              rateLimitRemaining.set(
                'ghs_3X0VGC4uvSelTLk3bbumXa8IycJNAx3I0j2z',
                0
              );
              rateLimitRemaining.set(
                'ghs_4Z0VGC4uvSelTLk3bbumXa8IycJNAx3I0j3a',
                0
              );
              return [
                403,
                {
                  message:
                    'API rate limit exceeded for installation ID 26434743.',
                },
                { 'x-ratelimit-remaining': 0 },
              ];
            })
            .get('/repos/SemaSandbox/astrobee/issues/comments')
            .query(() => true)
            .reply(200, [])
            .get('/repos/SemaSandbox/astrobee/pulls')
            .query(() => true)
            .reply(200, [])
            .get('/repos/SemaSandbox/astrobee/pulls/3')
            .reply(200, getPullRequestDetailPR3());
        });

        it('should throw an error', async () => {
          await expect(handler({ id: repository.id })).rejects.toThrow(
            'Ran out of GitHub API quota'
          );
        });

        describe('repository', () => {
          it('should not change sync status', () => {
            expect(repository.sync.status).toBeFalsy();
          });
        });
      });

      describe('when hitting GitHub secondary rate limit', () => {
        beforeAll(async () => {
          resetNocks();
          await SmartComment.deleteMany({});
          repository.sync = {};
          await repository.save();
        });

        beforeAll(() => {
          rateLimitRemaining.set(
            'ghs_3X0VGC4uvSelTLk3bbumXa8IycJNAx3I0j2z',
            1000
          );
          rateLimitRemaining.set(
            'ghs_4Z0VGC4uvSelTLk3bbumXa8IycJNAx3I0j3a',
            999
          );
        });

        beforeAll(() => {
          nock('https://api.github.com')
            .persist()
            .get('/repos/SemaSandbox/astrobee/installation')
            .reply(404);

          nock('https://api.github.com')
            .persist()
            .get('/repos/SemaSandbox/astrobee/pulls/comments')
            .query(() => true)
            .reply(function reply() {
              const authorization = this.req.headers.authorization[0];
              const [, token] = authorization.split(' ');
              tokenUsedForGitHubAPI = token;

              if (token === 'ghs_3X0VGC4uvSelTLk3bbumXa8IycJNAx3I0j2z') {
                return [
                  403,
                  {
                    message:
                      'You have exceeded a secondary rate limit. Please wait a few minutes before you try again.',
                  },
                  { 'retry-after': '60' },
                ];
              }
              if (token === 'ghs_4Z0VGC4uvSelTLk3bbumXa8IycJNAx3I0j3a') {
                return [200, getPullRequestCommentsForAstrobee()];
              }
              return [500];
            })
            .get('/repos/SemaSandbox/astrobee/issues/comments')
            .query(() => true)
            .reply(200, [])
            .get('/repos/SemaSandbox/astrobee/pulls')
            .query(() => true)
            .reply(200, [])
            .get('/repos/SemaSandbox/astrobee/pulls/3')
            .reply(200, getPullRequestDetailAstrobeePR());
        });

        beforeAll(async () => {
          await handler({ id: repository.id });
        });

        beforeAll(async () => {
          comments = await SmartComment.find({ repositoryId: repository });
        });

        it('should import comments', () => {
          expect(comments.length).toBe(1);
        });

        it('should retry using another token', () => {
          expect(tokenUsedForGitHubAPI).toBe(
            'ghs_4Z0VGC4uvSelTLk3bbumXa8IycJNAx3I0j3a'
          );
        });

        afterAll(() => resetRateLimitTracking());
      });

      afterAll(() => {
        sample.mockImplementation(previousSample);
      });
    });
  });

  describe('a GitHub comment by a deleted user', () => {
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
        cloneUrl: 'https://github.com/Semalab/phoenix',
      });
      await startSync({ repository, user });
      nockPhoenixInstallation();
    });

    beforeAll(() => {
      nock('https://api.github.com')
        .get('/repos/Semalab/phoenix/pulls/comments')
        .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
        .reply(200, [
          {
            ...getFirstPageOfPullRequestComments()[0],
            user: null,
          },
        ])
        .get('/repos/Semalab/phoenix/issues/comments')
        .query({ sort: 'created', direction: 'desc', page: 1, per_page: 100 })
        .reply(200, [])
        .get('/repos/Semalab/phoenix/pulls')
        .query({
          sort: 'created',
          direction: 'desc',
          page: 1,
          state: 'all',
          per_page: 100,
        })
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

    it('should not import the comment', async () => {
      const count = await SmartComment.countDocuments();
      expect(count).toBe(0);
    });
  });

  describe('app not installed anywhere', () => {
    beforeAll(async () => {
      nock.cleanAll();
      await Repository.deleteMany();
      await SmartComment.deleteMany();
    });

    beforeAll(() => {
      nock('https://api.github.com')
        .persist()
        .get('/repos/Semalab/phoenix/installation')
        .reply(404)
        .get('/app/installations')
        .query(() => true)
        .reply(200, []);
    });

    beforeAll(async () => {
      repository = await createRepository({
        name: 'phoenix',
        type: 'github',
        id: '237888452',
        cloneUrl: 'https://github.com/Semalab/phoenix',
      });
      await startSync({ repository, user });
    });

    describe('processing queue', () => {
      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/installation')
          .reply(404)
          .get('/app/installations')
          .query(() => true)
          .reply(200, []);
      });

      beforeAll(() => setDefaultNocks());

      it('should throw an error', async () => {
        await expect(handler({ id: repository.id })).rejects.toThrow(
          'Sema app not installed on any account'
        );
      });
    });
  });

  describe('private repository, app not installed', () => {
    beforeAll(async () => {
      nock.cleanAll();
      await Repository.deleteMany();
      await SmartComment.deleteMany();
    });

    beforeAll(() => {
      nock('https://api.github.com')
        .persist()
        .get('/repos/Semalab/phoenix/installation')
        .reply(404)
        .get('/repositories/237888452')
        .reply(404);
    });

    beforeAll(() => setDefaultNocks());

    beforeAll(async () => {
      repository = await createRepository({
        name: 'phoenix',
        type: 'github',
        id: '237888452',
        cloneUrl: 'https://github.com/Semalab/phoenix',
      });
      await startSync({ repository, user });
    });

    describe('processing queue', () => {
      beforeAll(() => {
        nock('https://api.github.com')
          .persist()
          .get('/repos/Semalab/phoenix/installation')
          .reply(404)
          .get('/repositories/237888452')
          .reply(404);
      });

      beforeAll(async () => {
        await handler({ id: repository.id });
      });

      describe('repository', () => {
        beforeAll(async () => {
          repository = await Repository.findById(repository._id);
        });

        it('should have sync status unauthorized', () => {
          expect(repository.sync.status).toBe('unauthorized');
        });

        it('should have visibility private', () => {
          expect(repository.visibility).toBe('private');
        });
      });
    });
  });

  describe('legacy repository with no clone URL', () => {
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
        id: '391620249',
      });
    });

    describe('processing queue', () => {
      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/SemaSandbox/astrobee/pulls/comments')
          .query(() => true)
          .reply(200, getPullRequestCommentsForAstrobee())
          .get('/repos/SemaSandbox/astrobee/issues/comments')
          .query(() => true)
          .reply(200, [])
          .get('/repos/SemaSandbox/astrobee/pulls')
          .query(() => true)
          .reply(200, [])
          .get('/repos/SemaSandbox/astrobee/pulls/3')
          .reply(200, getPullRequestDetailAstrobeePR());
      });

      beforeAll(async () => {
        await handler({ id: repository.id });
      });

      beforeAll(async () => {
        comments = await SmartComment.find({ repositoryId: repository });
      });

      it('should import comments', () => {
        expect(comments.length).toBe(1);
      });

      describe('repository', () => {
        beforeAll(async () => {
          repository = await Repository.findById(repository._id);
        });

        it('should have sync status "completed"', () => {
          expect(repository.sync.status).toBe('completed');
        });

        it('should have the updated full name', () => {
          expect(repository.fullName).toBe('SemaSandbox/astrobee');
        });

        it('should have the updated clone URL', () => {
          expect(repository.cloneUrl).toBe(
            'https://github.com/SemaSandbox/astrobee'
          );
        });
      });
    });
  });

  describe('renamed repository', () => {
    let comments;

    beforeAll(async () => {
      resetNocks();
      await Repository.deleteMany();
      await SmartComment.deleteMany();
    });

    beforeAll(async () => {
      repository = await createRepository({
        name: 'astromoth',
        type: 'github',
        id: '391620249',
        cloneUrl: 'https://github.com/SemaSandbox/astromoth',
        fullName: 'SemaSandbox/astromoth',
      });

      assert.equal(
        repository.cloneUrl,
        'https://github.com/SemaSandbox/astromoth'
      );
      assert.equal(repository.fullName, 'SemaSandbox/astromoth');
    });

    describe('processing queue', () => {
      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/SemaSandbox/astrobee/pulls/comments')
          .query(() => true)
          .reply(200, getPullRequestCommentsForAstrobee())
          .get('/repos/SemaSandbox/astrobee/issues/comments')
          .query(() => true)
          .reply(200, [])
          .get('/repos/SemaSandbox/astrobee/pulls')
          .query(() => true)
          .reply(200, [])
          .get('/repos/SemaSandbox/astrobee/pulls/3')
          .reply(200, getPullRequestDetailAstrobeePR());
      });

      beforeAll(async () => {
        await handler({ id: repository.id });
      });

      beforeAll(async () => {
        comments = await SmartComment.find({ repositoryId: repository });
      });

      it('should import comments', () => {
        expect(comments.length).toBe(1);
      });

      describe('repository', () => {
        beforeAll(async () => {
          repository = await Repository.findById(repository._id);
        });

        it('should have sync status "completed"', () => {
          expect(repository.sync.status).toBe('completed');
        });

        it('should have the updated name', () => {
          expect(repository.name).toBe('astrobee');
        });

        it('should have the updated full name', () => {
          expect(repository.fullName).toBe('SemaSandbox/astrobee');
        });

        it('should have the updated clone URL', () => {
          expect(repository.cloneUrl).toBe(
            'https://github.com/SemaSandbox/astrobee'
          );
        });
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
      body: 'Test',
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
      body: 'Test',
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

function getPullRequestDetailAstrobeePR() {
  return {
    url: 'https://api.github.com/repos/SemaSandbox/astrobee/pulls/3',
    id: 383552850,
    node_id: 'MDExOlB1bGxSZXF1ZXN0MzgzNTUyODUw',
    html_url: 'https://github.com/SemaSandbox/astrobee/pull/3',
    issue_url: 'https://api.github.com/repos/SemaSandbox/astrobee/issues/3',
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
      label: 'SemaSandbox:SP-224',
      ref: 'SP-224',
      sha: '5cf414e8a9cc594cdef7b73156c8adaf68191724',
      user: {
        login: 'SemaSandbox',
        id: 31629704,
        node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
        avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/SemaSandbox',
        html_url: 'https://github.com/SemaSandbox',
        type: 'Organization',
        site_admin: false,
      },
      repo: {
        id: 391620249,
        node_id: 'MDEwOlJlcG9zaXRvcnkyMzc4ODg0NTI=',
        name: 'astrobee',
        full_name: 'SemaSandbox/astrobee',
        private: true,
        owner: {
          login: 'SemaSandbox',
          id: 31629704,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
          avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/SemaSandbox',
          html_url: 'https://github.com/SemaSandbox',
          type: 'Organization',
          site_admin: false,
        },
        html_url: 'https://github.com/SemaSandbox/astrobee',
        description: 'Sema Code Quality Platform Web App',
        created_at: '2020-02-03T05:00:24Z',
        updated_at: '2022-01-10T16:48:10Z',
        pushed_at: '2022-05-16T18:59:54Z',
        clone_url: 'https://github.com/SemaSandbox/astrobee.git',
      },
    },
    base: {
      label: 'SemaSandbox:qa',
      ref: 'qa',
      sha: '0eb67e6907592253463eff8d6d21f3494b2213ca',
      user: {
        login: 'SemaSandbox',
        id: 31629704,
        node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
        avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/SemaSandbox',
        html_url: 'https://github.com/SemaSandbox',
        type: 'Organization',
        site_admin: false,
      },
      repo: {
        id: 391620249,
        node_id: 'MDEwOlJlcG9zaXRvcnkyMzc4ODg0NTI=',
        name: 'astrobee',
        full_name: 'SemaSandbox/astrobee',
        private: true,
        owner: {
          login: 'SemaSandbox',
          id: 31629704,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjMxNjI5NzA0',
          avatar_url: 'https://avatars.githubusercontent.com/u/31629704?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/SemaSandbox',
          html_url: 'https://github.com/SemaSandbox',
          type: 'Organization',
          site_admin: false,
        },
        html_url: 'https://github.com/SemaSandbox/astrobee',
        description: 'Sema Code Quality Platform Web App',
        created_at: '2020-02-03T05:00:24Z',
        updated_at: '2022-01-10T16:48:10Z',
        pushed_at: '2022-05-16T18:59:54Z',
        clone_url: 'https://github.com/SemaSandbox/astrobee.git',
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

function nockPhoenixInstallation() {
  nock('https://api.github.com')
    .persist()
    .get('/repos/Semalab/phoenix/installation')
    .reply(200, {
      id: '25676597',
    });
}

function getPullRequestCommentsForAstrobee() {
  return [
    {
      url: 'https://api.github.com/repos/SemaSandbox/astrobee/pulls/comments/545313646',
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
      pull_request_url:
        'https://api.github.com/repos/SemaSandbox/astrobee/pulls/3',
    },
  ];
}
