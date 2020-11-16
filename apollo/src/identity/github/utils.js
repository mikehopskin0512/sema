import { Octokit } from '@octokit/rest';

export const getProfile = async (token) => {
  const octokit = new Octokit({ auth: `token ${token}` });
  const { data: user } = await octokit.users.getAuthenticated();
  return user;
};

export const getAppRepos = async (token) => {
  const octokit = new Octokit({ auth: `token ${token}` });
  const { data: user } = await octokit.apps.listReposAccessibleToInstallation();
  return user;
};
