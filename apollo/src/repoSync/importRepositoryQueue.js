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

  const lastPage = (repository.sync.lastPage || 0) + 1;

  const octokit = getOctokit(repository);
  const { data: repo } = await octokit.request('/repositories/{id}', {
    id: repository.externalId,
  });
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

  const importSmartCommentFromGitHub = createGitHubImporter(octokit);

  for await (const response of pages) {
    const page = getPageFromResponse(response);
    logger.info(
      `Repo sync: Processing page ${page} for ${repo.owner.login}/${repo.name}`
    );
    await Promise.all(response.data.map(importSmartCommentFromGitHub));
    repository.sync.lastPage = page;
    await repository.save();
  }

  await setSyncCompleted(repository);
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

  const importSmartCommentFromGitHub = async (githubComment) => {
    const commentId = githubComment.id;
    const comment = githubComment.body;
    const { data: pullRequest } = await octokitCache.get(
      githubComment.pull_request_url
    );
    const { repo } = pullRequest.base;
    const githubMetadata = {
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
    };

    return await SmartComment.create({
      commentId,
      comment,
      githubMetadata,
      source: 'repoSync',
    });
  };

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
    'sync.lastPage': null,
  });
  await repository.save();
}

export { queue };
