import nock from 'nock';
import resetNocks from '../../test/nocks';
import * as userService from '../users/userService';
import {
  create as createRepository,
} from '../repositories/repositoryService';
import Repository from '../repositories/repositoryModel';
import SmartComment from '../comments/smartComments/smartCommentModel';
import handler from './githubWebhookQueue';

describe('Github Webhook Queue', () => {
  let repository;

  beforeAll(async () => {
    await userService.create({
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
    });

    describe('processing queue', () => {

      beforeAll(async () => {
        const payload = {
          "comment": {
            "url": "https://api.github.com/repos/Semalab/phoenix/pulls/comments/545313646",
            "pull_request_review_id": 554880620,
            "id": 545313646,
            "node_id": "MDI0OlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDU0NTMxMzY0Ng==",
            "commit_id": "7db0665a4c0f7e496d96920f1fe0db207bb4437c",
            "original_commit_id": "43d87631f9550c05ef2786513d76b4ba49c6aadb",
            "user": {
              "login": "pangeaware",
              "id": 1045023,
              "type": "User"
            },
            "body": "@jrock17 this function feels like it should live somewhere else as well with repo code.",
            "created_at": "2020-12-17T18:35:40Z",
            "updated_at": "2020-12-17T20:30:14Z",
            "pull_request_url": "https://api.github.com/repos/Semalab/phoenix/pulls/3"
          },
          "repository": {
            "id": '237888452'
          },
          "pull_request": {
            "user": {
              "login": "ada",
            },
            "base": {
              "repo": {
                "name": "phoenix",
                "id": "237888452",
                "html_url": "https://github.com/Semalab/phoenix"
              }
            }
          }
        };
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/3')
          .reply(200, getPullRequestDetailPR3());
        await handler(payload);
        nock('https://api.github.com')
          .get('/repos/Semalab/phoenix/pulls/3')
          .reply(200, getPullRequestDetailPR3());
        await handler(payload);
        comments = await SmartComment.find({ "githubMetadata.repo_id": repository.externalId });
      });

      it('should create smart comments on queue and should not create duplicate comments', () => {
        expect(comments.length).toBe(1);
      });
    });
  });
});

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

function nockPhoenixInstallation() {
  nock('https://api.github.com')
    .persist()
    .get('/repositories/237888452')
    .reply(200, {
      id: '237888452',
      name: 'phoenix',
    })
    .get('/repos/Semalab/phoenix/installation')
    .reply(200, {
      id: '25676597',
    });
}
