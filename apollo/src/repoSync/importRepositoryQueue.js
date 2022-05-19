import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import Cache from 'caching-map';
import logger from '../shared/logger';
import { queues } from '../queues';
import { github } from '../config';
import Repository from '../repositories/repositoryModel';
import SmartComment from '../comments/smartComments/smartCommentModel';

const queue = queues.self(module);

export default async function importRepository({ id }) {
  logger.info(`Repo sync: ${queue.name} processing repository ${id}`);

  const repository = await Repository.findById(id);

  const isRepoSyncSupported = repository.type === 'github';
  if (!isRepoSyncSupported) {
    logger.error(
      `Repo sync: Skipping repo sync for repository ${id}, type is ${repository.type}`
    );
    return;
  }

  await setSyncStarted(repository);

  const octokit = getOctokit(repository);
  const { owner, repo } = await getRepoById(octokit, repository.externalId);

  const importComment = createGitHubImporter(octokit);

  await Promise.all([
    importComments({
      octokit,
      entity: 'pullRequestComment',
      endpoint: `/repos/${owner}/${repo}/pulls/comments`,
      repository,
      importComment,
    }),
    importComments({
      octokit,
      entity: 'issueComment',
      endpoint: `/repos/${owner}/${repo}/issues/comments`,
      repository,
      importComment,
    }),
    importReviews({
      octokit,
      endpoint: `/repos/${owner}/${repo}/pulls`,
      repository,
      importComment,
    }),
  ]);

  await setSyncCompleted(repository);
}

// Imports pull request and issue comments.
// https://docs.github.com/en/rest/pulls/comments#get-a-review-comment-for-a-pull-request
// https://docs.github.com/en/rest/issues/comments#get-an-issue-comment
async function importComments({
  octokit,
  endpoint,
  entity,
  repository,
  importComment,
}) {
  const pages = resumablePaginate({ octokit, endpoint, entity, repository });
  for await (const data of pages) {
    await Promise.all(data.map(importComment));
  }
}

// Imports comments from pull request reviews.
// https://docs.github.com/en/rest/pulls/reviews#get-a-review-for-a-pull-request
async function importReviews({ octokit, endpoint, repository, importComment }) {
  const pages = resumablePaginate({
    octokit,
    endpoint,
    entity: 'pullRequestReview',
    repository,
  });

  for await (const data of pages) {
    await Promise.all(
      data.map((pullRequest) =>
        importReviewsFromPullRequest({
          octokit,
          pullRequest,
          importComment,
        })
      )
    );
  }
}

async function importReviewsFromPullRequest({
  octokit,
  pullRequest,
  importComment,
}) {
  const { data: reviews } = await octokit.pulls.listReviews({
    owner: pullRequest.base.repo.owner.login,
    repo: pullRequest.base.repo.name,
    pull_number: pullRequest.number,
  });

  await Promise.all(reviews.filter((r) => r.body.trim()).map(importComment));
}

function getOctokit(repository) {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: github.appId,
      privateKey: github.privateKey,
      installationId: repository.installationId,
    },
  });
}

function createGitHubImporter(octokit) {
  const octokitCache = new Cache(50);
  octokitCache.materialize = async (url) => await octokit.request(url);

  function getEntity(githubComment) {
    if ('pull_request_review_id' in githubComment) return 'pullRequestComment';
    if ('issue_url' in githubComment) return 'issueComment';
    if ('body' in githubComment) return 'pullRequestReview';
    throw new Error('Unknown comment type');
  }

  return async function importComment(githubComment) {
    const entity = getEntity(githubComment);
    const pullRequestURL =
      githubComment.pull_request_url ||
      githubComment.issue_url.replace('/issues/', '/pulls/');
    const commentId = githubComment.id;
    const comment = githubComment.body;
    const { data: pullRequest } = await octokitCache.get(pullRequestURL);
    const { repo } = pullRequest.base;
    const githubMetadata = {
      commentId,
      filename: githubComment.path,
      repo: repo.name,
      repo_id: repo.id,
      url: repo.html_url,
      created_at: githubComment.created_at || githubComment.submitted_at,
      updated_at: githubComment.updated_at || githubComment.submitted_at,
      user: {
        id: githubComment.user.id,
        login: githubComment.user.login,
      },
      requester: pullRequest.user.login,
      entity,
    };

    return await SmartComment.findOrCreate({
      comment,
      githubMetadata,
      source: 'repoSync',
    });
  };
}

async function setSyncStarted(repository) {
  repository.set({
    'sync.status': 'started',
    'sync.startedAt': new Date(),
  });
  await repository.save();
}

async function setSyncCompleted(repository) {
  repository.set({
    'sync.status': 'completed',
    'sync.completedAt': new Date(),
    'sync.lastPage': {},
  });
  await repository.save();
}

// Make sure we have the latest owner/repo pairs
// for a given repository ID.
async function getRepoById(octokit, id) {
  const { data: repo } = await octokit.request('/repositories/{id}', { id });
  return {
    owner: repo.owner.login,
    repo: repo.name,
  };
}

// Async iterator that paginates through GitHub resources
// and keeps track of progress (page) in the repository model.
// Consumers must process all items in a page without errors
// for the page to be considered complete.
// If any item fails to process, we'll reprocess the page
// the next time this function is called.
async function* resumablePaginate({ octokit, endpoint, entity, repository }) {
  const lastPageKey = `sync.lastPage.${entity}`;
  const lastPage = (repository.get(lastPageKey) || 0) + 1;

  const pages = octokit.paginate.iterator(endpoint, {
    sort: 'created',
    direction: 'desc',
    page: lastPage,
  });

  for await (const response of pages) {
    const url = new URL(response.url);
    const page = parseInt(url.searchParams.get('page') || 1, 10);
    logger.info(`Repo sync: Processing comments ${endpoint} page ${page}`);
    yield response.data;
    await repository.updateOne({ [lastPageKey]: page });
  }

  await repository.updateOne({ [lastPageKey]: null });
}

export { queue };
