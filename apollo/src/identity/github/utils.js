import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth';
import { github } from '../../config';

import errors from '../../shared/errors';

export const getProfile = async (token) => {
  const octokit = new Octokit({ auth: `token ${token}` });
  const { data: user } = await octokit.users.getAuthenticated();
  return user;
};

export const getUserEmails = async (token) => {
  const octokit = new Octokit({ auth: `token ${token}` });
  const { data: userEmails } = await octokit.users.listEmailsForAuthenticated();
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
        `No token found for installationId ${externalSourceId}`,
      );
    }

    return token;
  } catch (err) {
    // Do not return error, instead throw
    throw new errors.BadRequest(
      `Error fetching token for installationId ${externalSourceId}`,
    );
  }
};

export const getRepositoryList = async (token) => {
  const octokit = new Octokit({ auth: `token ${token}` });
  const { data } = await octokit.request('GET /user/repos');
  return data;
};

export const getGithubOrgsForAuthenticatedUser = async (token, perPage = 100, page = 1) => {
  const octokit = new Octokit({ auth: `token ${token}` });
  const { data } = await octokit.orgs.listForAuthenticatedUser({ per_page: perPage, page });
  
  const orgList = data && data.length ? data.map((orgItem) => ({
    id: orgItem.id,
    name: orgItem.login,
    description: orgItem.description,
    avatarUrl: orgItem.avatar_url
  })) : [];
  
  return orgList;
}

export const getRepositoriesForAuthenticatedUser = async (token, perPage = 100, page = 1) => {
  const octokit = new Octokit({ auth: `token ${token}` });
  const { data } = await octokit.repos.listForAuthenticatedUser({ per_page: perPage, page });
  
  const repositories = data && data.length ? data.map((repoData) => ({
    repoId: repoData.id,
    repoName: repoData.name,
    description: repoData.description,
    organizationId: repoData.owner?.id,
    organizationName: repoData.owner?.login,
    isPrivate: repoData.private
  })) : [];
  
  return repositories;
}