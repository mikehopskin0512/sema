import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import { github } from '../config';

export const getOctokit = async (repository) => {
  const installationId =
    repository.installationId ||
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
};

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

export const getOwnerAndRepo = (repository) => {
  const [, , , owner, repo] = repository.cloneUrl.split('/');
  return {
    owner,
    repo: repo.replace(/\.git$/, ''),
  };
};
