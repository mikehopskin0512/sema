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

    return await findOrCreateSmartComment({
      comment,
      githubMetadata,
      source: 'repoSync',
    });
  };
}

function getPageFromResponse(response) {
  const url = new URL(response.url);
  const page = parseInt(url.searchParams.get('page') || 1, 10);
  return page;
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

async function findOrCreateSmartComment(attrs) {
  try {
    return await SmartComment.create(attrs);
  } catch (error) {
    const isDuplicate =
      error.code === 11000 && error.keyPattern?.['githubMetadata.commentId'];
    if (isDuplicate) {
      return await SmartComment.findOne(error.keyValue);
    }
    throw error;
  }
}

async function getRepoById(octokit, id) {
  const { data: repo } = await octokit.request('/repositories/{id}', { id });
  return {
    owner: repo.owner.login,
    repo: repo.name,
  };
}

async function* resumablePaginate({ octokit, endpoint, entity, repository }) {
  const lastPageKey = `sync.lastPage.${entity}`;
  const lastPage = (repository.get(lastPageKey) || 0) + 1;

  const pages = octokit.paginate.iterator(endpoint, {
    sort: 'created',
    direction: 'desc',
    page: lastPage,
  });

  for await (const response of pages) {
    const page = getPageFromResponse(response);
    logger.info(`Repo sync: Processing comments ${endpoint} page ${page}`);
    yield response.data;
    await repository.updateOne({ [lastPageKey]: page });
  }

  await repository.updateOne({ [lastPageKey]: null });
}

export { queue };
