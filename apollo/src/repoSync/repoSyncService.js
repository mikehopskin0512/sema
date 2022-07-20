import { createAppAuth } from '@octokit/auth-app';
import { addSeconds } from 'date-fns';
import retry from 'async-retry';
import Bluebird from 'bluebird';
import { Octokit } from '@octokit/rest';
import { maxBy } from 'lodash';
import { github } from '../config';

const rateLimitedUntil = new Map();

export const getOctokit = async (repository) => {
  const isValidCloneURL = repository.cloneUrl?.startsWith('https://');
  if (!isValidCloneURL) {
    // Pre-validate hook will fix the format of the
    // clone URL, if present.
    await repository.save();
  }

  const octokit =
    (await getOctokitForRepository(repository)) || (await getOctokitFromPool());

  if (!octokit) {
    return null;
  }

  if (repository.externalId) {
    // Probe access to the repository
    try {
      const { data: githubRepository } = await octokit.request(
        '/repositories/{id}',
        {
          id: repository.externalId,
        }
      );
      if (!repository.cloneUrl) {
        // eslint-disable-next-line no-param-reassign
        repository.cloneUrl = githubRepository.clone_url;
        await repository.save();
      }
    } catch (error) {
      if (error.status === 404) {
        // No access.
        return null;
      }
      throw error;
    }
  }

  return octokit;
};

// Runs the given function with a suitable Octokit instance.
// Rate limit errors are retried with a new Octokit instance
// from our pool (see getOctokitFromPool()).
export async function withOctokit(repository, fn) {
  await retry(
    async (bail) => {
      try {
        const octokit = await getOctokit(repository);
        await fn(octokit);
      } catch (error) {
        // Retry immediately if we hit the rate limit
        // (using a different token from the pool).
        if (isRateLimitError(error)) throw error;

        // Actually throw other errors.
        bail(error);
      }
    },
    {
      retries: 3,
    }
  );
}

function isRateLimitError(error) {
  return (
    error.status === 403 &&
    (error.response?.headers?.['x-ratelimit-remaining'] === '0' ||
      error.response?.headers?.['retry-after'])
  );
}

const appOctokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: github.appId,
    privateKey: github.privateKey,
  },
});

export async function getOctokitForRepository(repository) {
  try {
    const { owner, repo } = getOwnerAndRepo(repository);
    const { data: installation } = await appOctokit.apps.getRepoInstallation({
      owner,
      repo,
    });

    return createOctokit(installation.id);
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

// Use any installation ID, hopefully importing a public repository.
export async function getOctokitFromPool() {
  const octokits = await getOctokitsWithLimits();

  if (octokits.length === 0)
    throw new Error('Sema app not installed on any account');

  const now = new Date().getTime();
  const withRemainingLimit = octokits
    .filter(
      ({ installation }) =>
        !rateLimitedUntil.has(installation.id) ||
        rateLimitedUntil.get(installation.id) < now
    )
    .filter(({ rateLimit }) => rateLimit.resources.core.remaining > 500);

  if (withRemainingLimit.length === 0)
    throw new Error('Ran out of GitHub API quota');

  const { installation, octokit } = maxBy(
    withRemainingLimit,
    'rateLimit.resources.core.remaining'
  );

  octokit.hook.wrap('request', async (request, options) => {
    try {
      return await request(options);
    } catch (error) {
      // Secondary rate limits are not exposed as part
      // of the rate limit API, so we must track these
      // errors manually.
      const isSecondaryRateLimitError =
        error.status === 403 && error.response?.headers?.['retry-after'];
      if (isSecondaryRateLimitError) {
        const retryAfter = parseInt(error.response.headers['retry-after'], 10);
        const retryAt = addSeconds(new Date(), retryAfter);
        rateLimitedUntil.set(installation.id, retryAt);
        // Will trigger a retry using a different token from the pool.
        throw error;
      }
      throw error;
    }
  });

  return octokit;
}

export async function getOctokitsWithLimits() {
  const { data: installations } = await appOctokit.apps.listInstallations({
    per_page: 100,
  });
  const withRateLimits = await Bluebird.resolve(installations).map(
    async (installation) => {
      const octokit = createOctokit(installation.id);
      const { data: rateLimit } = await octokit.rateLimit.get();
      return { octokit, installation, rateLimit };
    },
    { concurrency: 30 }
  );
  return withRateLimits;
}

function createOctokit(installationId) {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: github.appId,
      privateKey: github.privateKey,
      installationId,
    },
  });
}

export const getOwnerAndRepo = (repository) => {
  const [, , , owner, repo] = repository.cloneUrl.split('/');
  return {
    owner,
    repo: repo.replace(/\.git$/, ''),
  };
};

export async function importReviewsFromPullRequest({
  octokit,
  pullRequest,
  importComment,
}) {
  const { data: reviews } = await octokit.pulls.listReviews({
    owner: pullRequest.base.repo.owner.login,
    repo: pullRequest.base.repo.name,
    pull_number: pullRequest.number,
  });

  await Bluebird.resolve(reviews.filter((r) => r.body.trim())).map(
    importComment,
    { concurrency: 10 }
  );
}

export async function setSyncStarted(repository) {
  repository.set({
    'sync.status': 'started',
    'sync.startedAt': new Date(),
    'sync.erroredAt': null,
    'sync.error': null,
  });
  await repository.save();
}

export async function setSyncCompleted(repository) {
  repository.set({
    'sync.status': 'completed',
    'sync.completedAt': new Date(),
    'sync.erroredAt': null,
    'sync.error': null,
  });
  await repository.save();
}

export async function setSyncErrored(repository, error) {
  repository.set({
    'sync.status': 'errored',
    'sync.erroredAt': new Date(),
    'sync.error': error.message || error.toString().split('\n')[0],
  });
  await repository.save();
}

export async function setSyncUnauthorized(repository) {
  repository.set({
    'sync.status': 'unauthorized',
    'sync.erroredAt': new Date(),
    'sync.error': null,
  });
  await repository.save();
}

export function resetRateLimitTracking() {
  rateLimitedUntil.clear();
}
