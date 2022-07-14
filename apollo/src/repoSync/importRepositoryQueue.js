import Bluebird from 'bluebird';
import logger from '../shared/logger';
import { queues } from '../queues';
import Repository from '../repositories/repositoryModel';
import SmartComment from '../comments/smartComments/smartCommentModel';
import createGitHubImporter from './github';
import {
  getOctokit,
  getOwnerAndRepo,
  importReviewsFromPullRequest,
  setSyncErrored,
  setSyncUnauthorized,
  setSyncStarted,
  setSyncCompleted,
} from './repoSyncService';

const queue = queues.self(module);

export default async function importRepository({ id }) {
  const repository = await Repository.findById(id);
  if (!repository)
    logger.info(
      `Repo sync: ${queue.name} processing repository ${id}: not found`
    );

  logger.info(
    `Repo sync: ${queue.name} processing repository ${repository.fullName} ${id}`
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

  const octokit = await getOctokit(repository);
  if (!octokit) {
    await setSyncUnauthorized(repository);
    return;
  }

  await setSyncStarted(repository);

  try {
    const importComment = createGitHubImporter(octokit);

    await Promise.all([
      importComments({
        octokit,
        type: 'pullRequestComment',
        endpoint: `/repos/{owner}/{repo}/pulls/comments`,
        repository,
        importComment,
      }),
      importComments({
        octokit,
        type: 'issueComment',
        endpoint: `/repos/{owner}/{repo}/issues/comments`,
        repository,
        importComment,
      }),
      importReviews({
        octokit,
        endpoint: `/repos/{owner}/{repo}/pulls`,
        repository,
        importComment,
      }),
    ]);

    await setSyncCompleted(repository);

    logger.info(
      `Repo sync: Completed processing repository ${repository.fullName} ${id}`
    );
  } catch (error) {
    logger.error(error);
    await setSyncErrored(repository, error);
    throw error;
  }
}

// Imports pull request and issue comments.
// https://docs.github.com/en/rest/pulls/comments#get-a-review-comment-for-a-pull-request
// https://docs.github.com/en/rest/issues/comments#get-an-issue-comment
async function importComments({
  octokit,
  endpoint,
  type,
  repository,
  importComment,
}) {
  const pages = resumablePaginate({ octokit, endpoint, type, repository });
  for await (const data of pages) {
    await Bluebird.resolve(data).map(importComment, { concurrency: 10 });
  }

  await updateLastUpdatedTimestamp({ repository, type });
}

// Imports comments from pull request reviews.
// https://docs.github.com/en/rest/pulls/reviews#get-a-review-for-a-pull-request
async function importReviews({ octokit, endpoint, repository, importComment }) {
  const pages = resumablePaginate({
    octokit,
    endpoint,
    type: 'pullRequestReview',
    repository,
    query: { state: 'all' },
  });

  for await (const data of pages) {
    await Bluebird.resolve(data).map(
      (pullRequest) =>
        importReviewsFromPullRequest({
          octokit,
          pullRequest,
          importComment,
        }),
      { concurrency: 10 }
    );
  }

  await updateLastUpdatedTimestamp({ repository, type: 'pullRequestReview' });
}

// Async iterator that paginates through GitHub resources
// and keeps track of progress (page) in the repository model.
// Consumers must process all items in a page without errors
// for the page to be considered complete.
// If any item fails to process, we'll reprocess the page
// the next time this function is called.
async function* resumablePaginate({
  octokit,
  endpoint,
  type,
  repository,
  query = {},
}) {
  const progressKey = `sync.progress.${type}`;
  const currentPage = repository.get(progressKey)?.currentPage || 0;
  const lastPage = repository.get(progressKey)?.lastPage;

  const alreadyDone = lastPage && currentPage + 1 > lastPage;
  if (alreadyDone) {
    return;
  }

  const { owner, repo } = getOwnerAndRepo(repository);
  const pages = octokit.paginate.iterator(endpoint, {
    owner,
    repo,
    sort: 'created',
    direction: 'desc',
    page: currentPage + 1,
    ...query,
  });

  for await (const response of pages) {
    const url = new URL(response.url);
    const page = parseInt(url.searchParams.get('page') || 1, 10);
    const pagination = parseLinkHeader(response.headers.link);
    if (pagination.last) {
      await repository.updateOne({
        [`${progressKey}.lastPage`]: pagination.last,
      });
    }
    logger.info(`Repo sync: Processing comments ${endpoint} page ${page}`);
    yield response.data;
    await repository.updateOne({ [`${progressKey}.currentPage`]: page });
  }
}

// Parse GitHub HTTP Link header into an object
// with name and page number, e.g.:
//
//   {
//     prev: 3,
//     next: 5,
//     last: 10
//   }
//
// Adapted from https://gist.github.com/niallo/3109252.
function parseLinkHeader(header) {
  // GitHub API doesn't return a Link header when there is only one page.
  if (!header) return { last: 1 };

  const parts = header.split(',');
  const object = parts.reduce((accum, part) => {
    const section = part.split(';');
    const url = new URL(section[0].replace(/<(.*)>/, '$1').trim());
    const name = section[1].replace(/rel="(.*)"/, '$1').trim();
    const page = parseInt(url.searchParams.get('page'), 10);
    return {
      ...accum,
      [name]: page,
    };
  }, {});
  return object;
}

// If we do polling for a keeping a repository up to date
// (no webhooks), we need to know the maximum updated at timestamp
// for each type of comment.
async function updateLastUpdatedTimestamp({ repository, type }) {
  const lastUpdatedAt = (
    await SmartComment.findOne({
      'repositoryId': repository._id,
      'githubMetadata.type': type,
    }).sort({
      'githubMetadata.updated_at': -1,
    })
  )?.githubMetadata.updated_at;

  if (lastUpdatedAt) {
    await repository.updateOne({
      $max: { [`sync.progress.${type}.lastUpdatedAt`]: lastUpdatedAt },
    });
  }
}

export { queue };
