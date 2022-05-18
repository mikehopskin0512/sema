import nock from 'nock';
import resetNocks from '../../test/nocks';
import * as userService from '../users/userService';
import { findByExternalId as findSmartCommentsByExternalId } from '../comments/smartComments/smartCommentService';
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
          .get('/repositories/237888452')
          .reply(200, getRepositoryDetail());
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, getFirstPageOfPullRequestComments(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=2&sort=created&direction=desc>; rel="next"',
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
            Link: '<https://api.github.com/repos/Semalab/phoenix/issues/comments?page=2&sort=created&direction=desc>; rel="next"',
          })
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 2 })
          .reply(200, getSecondPageOfIssueComments());
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/3')
          .reply(200, getPullRequestDetail());
      });

      beforeAll(async () => {
        await handler({ id: repository.id });
      });

      beforeAll(async () => {
        comments = await findSmartCommentsByExternalId(repository.externalId);
      });

      it('should have six comments', () => {
        expect(comments.length).toBe(6);
      });

      describe('first pull request comment', () => {
        let comment;

        beforeAll(() => {
          comment = comments.find(
            (c) => c.githubMetadata.entity === 'pullRequestComment'
          );
        });

        it('should have source "repoSync"', () => {
          expect(comment.source).toBe('repoSync');
        });

        it('should not reference a user', () => {
          expect(comment.userId).toBeUndefined();
        });

        it('should have comment body', () => {
          expect(comment.comment).toBe(
            '@jrock17 i know this is the logic you were referring to yesterday...'
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

          it('should store the file name', () => {
            expect(githubMetadata.filename).toBe(
              'apollo/src/analysis/index.js'
            );
          });

          it('should store the repo name', () => {
            expect(githubMetadata.repo).toBe('phoenix');
          });

          it('should store the GitHub comment ID', () => {
            expect(githubMetadata.commentId).toBe('545317614');
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

      describe('first issue comment', () => {
        let comment;

        beforeAll(() => {
          comment = comments.find(
            (c) => c.githubMetadata.entity === 'issueComment'
          );
        });

        it('should have source "repoSync"', () => {
          expect(comment.source).toBe('repoSync');
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
            expect(githubMetadata.commentId).toBe('1130011291');
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
        nock('https://api.github.com')
          .get('/repositories/237888452')
          .reply(200, getRepositoryDetail());
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, getFirstPageOfPullRequestComments(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=2&sort=created&direction=desc>; rel="next"',
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
            Link: '<https://api.github.com/repos/Semalab/phoenix/issues/comments?page=2&sort=created&direction=desc>; rel="next"',
          })
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 2 })
          .reply(200, getSecondPageOfIssueComments());
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/3')
          .reply(200, getPullRequestDetail());
      });

      beforeAll(async () => {
        await handler({ id: repository.id });
      });

      beforeAll(async () => {
        comments = await findSmartCommentsByExternalId(repository.externalId);
      });

      it('should have six comments', () => {
        expect(comments.length).toBe(6);
      });
    });

    describe('when syncing pull request comments fails half-way through', () => {
      let handlerError;

      beforeAll(async () => {
        repository.sync = {};
        await repository.save();
        await SmartComment.deleteMany({});
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repositories/237888452')
          .reply(200, getRepositoryDetail());
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/comments')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, getFirstPageOfPullRequestComments(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/pulls/comments?page=2&sort=created&direction=desc>; rel="next"',
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
          .reply(200, []);
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/3')
          .reply(200, getPullRequestDetail());
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
        expect(handlerError).not.toBeNull();
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
          nock('https://api.github.com')
            .get('/repositories/237888452')
            .reply(200, getRepositoryDetail());
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
            .reply(200, getSecondPageOfPullRequestComments());
        });

        beforeAll(() => {
          // Only test resuming of pull request comments.
          nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/issues/comments')
            .query({ sort: 'created', direction: 'desc', page: 1 })
            .reply(200, []);
        });

        beforeAll(() => {
          nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/pulls/3')
            .reply(200, getPullRequestDetail());
        });

        beforeAll(async () => {
          await handler({ id: repository.id });
        });

        beforeAll(async () => {
          comments = await findSmartCommentsByExternalId(repository.externalId);
        });

        it('should import all pull request comments', () => {
          const pullRequestComments = comments.filter(
            (c) => c.githubMetadata.entity === 'pullRequestComment'
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

          it('should not have a record of the last page processed', () => {
            expect(repository.sync.lastPage.pullRequestComment).toBe(null);
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
          .get('/repositories/237888452')
          .reply(200, getRepositoryDetail());
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/issues/comments')
          .query({ sort: 'created', direction: 'desc', page: 1 })
          .reply(200, getFirstPageOfIssueComments(), {
            Link: '<https://api.github.com/repos/Semalab/phoenix/issues/comments?sort=created&direction=desc&page=2>; rel="next"',
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
          .reply(200, []);
      });

      beforeAll(() => {
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/3')
          .reply(200, getPullRequestDetail());
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
          nock('https://api.github.com')
            .get('/repositories/237888452')
            .reply(200, getRepositoryDetail());
        });

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
            .reply(200, []);
        });

        beforeAll(() => {
          nock('https://api.github.com')
            .get('/repos/Semalab/phoenix/pulls/3')
            .reply(200, getPullRequestDetail());
        });

        beforeAll(async () => {
          await handler({ id: repository.id });
        });

        beforeAll(async () => {
          comments = await findSmartCommentsByExternalId(repository.externalId);
        });

        it('should import all issue comments', () => {
          const issueComments = comments.filter(
            (c) => c.githubMetadata.entity === 'issueComment'
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

          it('should not have a record of the last page processed', () => {
            expect(repository.sync.lastPage.issueComment).toBe(null);
          });
        });
      });
    });
  });
});

function getRepositoryDetail() {
  return {
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
    pushed_at: '2022-05-17T15:44:01Z',
    clone_url: 'https://github.com/Semalab/phoenix.git',
    archived: false,
    disabled: false,
    organization: {
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
  };
}

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
      body: '@jrock17 i know this is the logic you were referring to yesterday...',
      created_at: '2020-12-17T18:41:44Z',
      updated_at: '2020-12-17T20:30:14Z',
      html_url:
        'https://github.com/Semalab/phoenix/pull/92#discussion_r545317614',
      pull_request_url: 'https://api.github.com/repos/Semalab/phoenix/pulls/3',
    },
  ];
}

function getPullRequestDetail() {
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
