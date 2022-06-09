import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import logger from '../shared/logger';
import { queues } from '../queues';
import { github } from '../config';
import Repository from '../repositories/repositoryModel';
import createGitHubImporter from './github';

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

  try {
    const octokit = await getOctokit(repository);
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
  } catch (error) {
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
    await Promise.all(data.map(importComment));
  }
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

async function getOctokit(repository) {
  const installationId =
    (await findInstallationIdForRepository(repository)) ||
    (await findSomeInstallationId());

  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: github.appId,
      privateKey: github.privateKey,
      installationId,
    },
  });
}

const appOctokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: github.appId,
    privateKey: github.privateKey,
  },
});

async function findInstallationIdForRepository(repository) {
  try {
    const { owner, repo } = getOwnerAndRepo(repository);
    const { data: installation } = await appOctokit.apps.getRepoInstallation({
      owner,
      repo,
    });
    return installation.id;
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

// Use any installation ID, hopefully importing a public repository.
async function findSomeInstallationId() {
  const { data: installations } = await appOctokit.apps.listInstallations();
  return installations[0]?.id;
}

function getOwnerAndRepo(repository) {
  const [, , , owner, repo] = repository.cloneUrl.split('/');
  return {
    owner,
    repo: repo.replace(/\.git$/, ''),
  };
}

async function setSyncStarted(repository) {
  repository.set({
    'sync.status': 'started',
    'sync.startedAt': new Date(),
    'sync.erroredAt': null,
    'sync.error': null,
  });
  await repository.save();
}

async function setSyncCompleted(repository) {
  repository.set({
    'sync.status': 'completed',
    'sync.completedAt': new Date(),
    'sync.erroredAt': null,
    'sync.error': null,
  });
  await repository.save();
}

async function setSyncErrored(repository, error) {
  repository.set({
    'sync.status': 'errored',
    'sync.erroredAt': new Date(),
    'sync.error': error.message || error.toString().split('\n')[0],
  });
  await repository.save();
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
  if (!header) return {};

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

export { queue };
