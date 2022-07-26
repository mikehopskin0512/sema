import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth';
import { github } from '../../config';
import uniqBy from '../../shared/uniqBy';
import logger from '../../shared/logger';
import { createNewOrgsFromGithub } from '../../organizations/organizationService';
import {
  create as createRepository,
  startSync,
} from '../../repositories/repositoryService';
import errors from '../../shared/errors';
import { addRepositoryToIdentity } from '../../users/userService';

export const getProfile = async (token) => {
  const octokit = new Octokit({ auth: `token ${token}` });
  const { data: user } = await octokit.users.getAuthenticated();
  return user;
};

export const getUserEmails = async (token) => {
  const octokit = new Octokit({ auth: `token ${token}` });
  const { data: userEmails } =
    await octokit.users.listEmailsForAuthenticatedUser();
  return userEmails;
};

export const getAppRepos = async (token) => {
  const octokit = new Octokit({ auth: `token ${token}` });
  const { data: user } = await octokit.apps.listReposAccessibleToInstallation();
  return user;
};

// GitHub token fetch
export const fetchGithubToken = async (externalSourceId) => {
  try {
    const auth = createAppAuth({
      clientId: github.clientId,
      clientSecret: github.clientSecret,
      id: github.appId,
      installationId: externalSourceId,
      privateKey: github.privateKey,
    });

    const { token } = await auth({ type: 'installation' });
    if (!token) {
      throw new errors.NotFound(
        `No token found for installationId ${externalSourceId}`
      );
    }

    return token;
  } catch (err) {
    // Do not return error, instead throw
    throw new errors.BadRequest(
      `Error fetching token for installationId ${externalSourceId}`
    );
  }
};

export const getRepositoryList = async (token) => {
  const octokit = new Octokit({ auth: `token ${token}` });
  const { data } = await octokit.request('GET /user/repos');
  return data;
};

export const getGithubOrgsForAuthenticatedUser = async (
  token,
  perPage = 100,
  page = 1
) => {
  const octokit = new Octokit({ auth: `token ${token}` });
  const { data: repos } = await octokit.repos.listForAuthenticatedUser({
    per_page: perPage,
    page,
  });

  return getUniqueOrgsFromRepos(repos);
};

export const getRepositoriesForAuthenticatedUser = async (
  token,
  perPage = 100,
  page = 1
) => {
  const octokit = new Octokit({ auth: `token ${token}` });
  const { data } = await octokit.repos.listForAuthenticatedUser({
    per_page: perPage,
    page,
  });

  const repositories =
    data && data.length
      ? data.map((repoData) => ({
          repoId: repoData.id,
          repoName: repoData.name,
          description: repoData.description,
          organizationId: repoData.owner?.id,
          organizationName: repoData.owner?.login,
          isPrivate: repoData.private,
        }))
      : [];

  return repositories;
};

const AMOUNT_OF_REPOS_TO_SYNC_AUTOMATICALLY = 10;

export const syncUser = async ({ user, token }) => {
  const octokit = new Octokit({ auth: `token ${token}` });
  const repos = await octokit.paginate(octokit.repos.listForAuthenticatedUser, {
    per_page: 100,
    sort: 'pushed',
    visibility: 'public',
    affiliation: ['owner', 'collaborator'],
  });

  const uniqueOrgs = getUniqueOrgsFromRepos(repos);

  // Wait for recent repositories to be created,
  // and queue these for sync.
  // Other repos get created in the background, without
  // blocking login.
  const recentRepos = repos.slice(0, AMOUNT_OF_REPOS_TO_SYNC_AUTOMATICALLY);
  const nonRecentRepos = repos.slice(recentRepos.length);

  await Promise.all([
    createNewOrgsFromGithub(uniqueOrgs, user._id),
    ...recentRepos.map((repo) =>
      createRepositoryForUser({ repo, user, sync: true })
    ),
  ]);

  // Intentionally not awaiting for this promise.
  Promise.all([
    nonRecentRepos.map((repo) =>
      createRepositoryForUser({ repo, user, sync: false })
    ),
  ]).catch(logger.error);
};

async function createRepositoryForUser({ repo, user, sync = false }) {
  const repository = await createRepository({
    type: 'github',
    id: repo.id,
    name: repo.name,
    description: repo.description,
    language: repo.language,
    cloneUrl: repo.clone_url,
    repositoryCreatedAt: repo.created_at,
    repositoryUpdatedAt: repo.updated_at,
    visibility: repo.visibility,
  });
  await repository.updateOne({ $addToSet: { 'repoStats.userIds': user._id } });
  await addRepositoryToIdentity(user, repository);
  const shouldSync = sync && !repository.sync.status;
  if (shouldSync) {
    await startSync({ repository, user });
  }
}

function getUniqueOrgsFromRepos(repos) {
  const orgs = repos
    .map((repo) => repo.owner)
    .filter((owner) => owner.type === 'Organization');
  const uniqueOrgs = uniqBy(orgs, (o) => o.login);
  return uniqueOrgs;
}
