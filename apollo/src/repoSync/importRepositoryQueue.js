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
  const { data: repo } = await octokit.request('/repositories/{id}', {
    id: repository.externalId,
  });

  const importSmartCommentFromGitHub = createGitHubImporter(octokit);

  await Promise.all([
    importPullRequestComments({
      octokit,
      repo,
      repository,
      importSmartCommentFromGitHub,
    }),
    importIssueComments({
      octokit,
      repo,
      repository,
      importSmartCommentFromGitHub,
    }),
  ]);

  await setSyncCompleted(repository);
}

async function importPullRequestComments({
  octokit,
  repo,
  repository,
  importSmartCommentFromGitHub,
}) {
  const lastPage = (repository.sync.lastPage.pullRequestComment || 0) + 1;

  const pages = octokit.paginate.iterator(
    octokit.pulls.listReviewCommentsForRepo,
    {
      owner: repo.owner.login,
      repo: repo.name,
      sort: 'created',
      direction: 'desc',
      page: lastPage,
    }
  );

  for await (const response of pages) {
    const page = getPageFromResponse(response);
    logger.info(
      `Repo sync: Processing pull request comments page ${page} for ${repo.owner.login}/${repo.name}`
    );
    await Promise.allSettled(response.data.map(importSmartCommentFromGitHub));
    await repository.updateOne({ 'sync.lastPage.pullRequestComment': page });
  }

  await repository.updateOne({ 'sync.lastPage.pullRequestComment': null });
}

async function importIssueComments({
  octokit,
  repo,
  importSmartCommentFromGitHub,
  repository,
}) {
  const lastPage = (repository.sync.lastPage.issueComment || 0) + 1;

  const pages = octokit.paginate.iterator(octokit.issues.listCommentsForRepo, {
    owner: repo.owner.login,
    repo: repo.name,
    sort: 'created',
    direction: 'desc',
    page: lastPage,
  });

  for await (const response of pages) {
    const page = getPageFromResponse(response);
    logger.info(
      `Repo sync: Processing issue comments page ${page} for ${repo.owner.login}/${repo.name}`
    );
    await Promise.allSettled(response.data.map(importSmartCommentFromGitHub));
    await repository.updateOne({ 'sync.lastPage.issueComment': page });
  }

  await repository.updateOne({ 'sync.lastPage.issueComment': null });
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
    throw new Error('Unknown comment type');
  }

  async function importSmartCommentFromGitHub(githubComment) {
    const entity = getEntity(githubComment);
    const pullRequestURL =
      entity === 'pullRequestComment'
        ? githubComment.pull_request_url
        : githubComment.issue_url.replace('/issues/', '/pulls/');
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
      created_at: githubComment.created_at,
      updated_at: githubComment.updated_at,
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
  }

  return importSmartCommentFromGitHub;
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

export { queue };
