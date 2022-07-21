import Bluebird from 'bluebird';
import { max } from 'lodash';
import logger from '../shared/logger';
import { queues } from '../queues';
import Repository from '../repositories/repositoryModel';
import createGitHubImporter from './github';
import {
  withOctokit,
  getOwnerAndRepo,
  importReviewsFromPullRequest,
  setSyncErrored,
  setSyncUnauthorized,
} from './repoSyncService';

const queue = queues.self(module);

export default async function pollRepository({ id }) {
  const repository = await Repository.findById(id);
  if (!repository)
    logger.info(
      `Repo sync: ${queue.name} processing repository ${id}: not found`
    );

  const isRepoSyncSupported = repository.type === 'github';
  if (!isRepoSyncSupported) {
    logger.error(
      `Repo sync: Skipping repo sync for repository ${id}, type is ${repository.type}`
    );
    return;
  }

  if (!repository.cloneUrl) {
    await setSyncErrored(
      repository,
      'Repository not found on GitHub (no clone URL)'
    );
    return;
  }

  await withOctokit(repository, async (octokit) => {
    if (!octokit) {
      await setSyncUnauthorized(repository);
      return;
    }

    try {
      const importComment = createGitHubImporter(octokit);

      await Promise.all([
        pollComments({
          octokit,
          type: 'pullRequestComment',
          endpoint: `/repos/{owner}/{repo}/pulls/comments`,
          repository,
          importComment,
        }),
        pollComments({
          octokit,
          type: 'issueComment',
          endpoint: `/repos/{owner}/{repo}/issues/comments`,
          repository,
          importComment,
        }),
        pollReviews({
          octokit,
          endpoint: `/repos/{owner}/{repo}/pulls`,
          repository,
          importComment,
        }),
      ]);

      // calculate repoStats
      await repository.updateRepoStats();

      logger.info(
        `Repo sync: Completed polling repository ${repository.fullName} ${id}`
      );
    } catch (error) {
      logger.error(error);
      await setSyncErrored(repository, error);
      throw error;
    }
  });
}

// Imports pull request and issue comments that were updated since
// the last poll.
//
// These endpoints support querying using a `since` attribute,
// so we query in ascending order and update the last updated
// timestamp at the repository level after processing each page.
//
// If the worker crashes and we retry, we'll continue where we
// left off.
async function pollComments({
  octokit,
  endpoint,
  type,
  repository,
  importComment,
}) {
  const progressKey = `sync.progress.${type}`;
  const since = repository.get(progressKey)?.lastUpdatedAt?.toISOString();
  const { owner, repo } = getOwnerAndRepo(repository);
  const pages = octokit.paginate.iterator(endpoint, {
    owner,
    repo,
    sort: 'updated',
    direction: 'asc',
    page: 1,
    ...(since ? { since } : {}),
  });

  for await (const { data } of pages) {
    await Bluebird.resolve(data).map(importComment, { concurrency: 10 });
    const updatedAt = max(data.map((item) => item.updated_at));
    await repository.updateOne({
      $max: {
        [`${progressKey}.lastUpdatedAt`]: updatedAt,
      },
    });
  }
}

// Imports comments from pull request reviews using standard pagination.
//
// This endpoint does not support querying using a `since` attribute,
// so we query in descending order until we see the first pull request
// that was updated before the last poll.
//
// https://docs.github.com/en/rest/pulls/reviews#get-a-review-for-a-pull-request
async function pollReviews({ octokit, endpoint, repository, importComment }) {
  const progressKey = `sync.progress.pullRequestReview`;
  const lastUpdatedAt = repository.get(progressKey)?.lastUpdatedAt;
  const { owner, repo } = getOwnerAndRepo(repository);
  const pages = octokit.paginate.iterator(endpoint, {
    owner,
    repo,
    sort: 'updated',
    direction: 'desc',
    page: 1,
    state: 'all',
  });
  let updatedAt;

  for await (const { data } of pages) {
    const shouldBreak =
      lastUpdatedAt && new Date(data[0]?.updated_at) <= lastUpdatedAt;
    if (shouldBreak) break;

    await Bluebird.resolve(data).map(
      (pullRequest) =>
        importReviewsFromPullRequest({
          octokit,
          pullRequest,
          importComment,
        }),
      { concurrency: 10 }
    );
    if (!updatedAt) updatedAt = data[0]?.updated_at;
  }

  await repository.updateOne({
    $max: {
      [`${progressKey}.lastUpdatedAt`]: updatedAt,
    },
  });
}

export { queue };
