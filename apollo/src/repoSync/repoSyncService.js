import { createAppAuth } from '@octokit/auth-app';
import Bluebird from 'bluebird';
import { Octokit } from '@octokit/rest';
import { maxBy } from 'lodash';
import { github } from '../config';
import logger from '../shared/logger';

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
  const { data: installations } = await appOctokit.apps.listInstallations();
  const withRateLimits = await Bluebird.resolve(installations)
    .map(
      async (installation) => {
        const octokit = createOctokit(installation.id);
        const { data: rateLimit } = await octokit.rateLimit.get();
        return { octokit, rateLimit };
      },
      { concurrency: 30 }
    )
    .filter(({ rateLimit }) => rateLimit.resources.core.remaining > 500);

  if (withRateLimits.length === 0) {
    logger.warn('Could not find any installation with rate limit remaining');
    return null;
  }

  const { octokit } = maxBy(
    withRateLimits,
    'rateLimit.resources.core.remaining'
  );
  return octokit;
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
