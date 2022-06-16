import logger from '../shared/logger';
import { queues } from '../queues';
import { findByExternalId } from '../repositories/repositoryService';
import createGitHubImporter from '../repoSync/github';
import { getOctokit } from '../repoSync/repoSyncService';

const queue = queues.self(module);

export default async function githubWebhook(body) {
  const repository = await findByExternalId(body.repository.id);
  const isRepoSyncSupported = repository.type === 'github';
  if (!isRepoSyncSupported) {
    logger.error(
      `Repo sync: Skipping repo sync for repository ${body.repository.id}, type is ${repository.type}`
    );
    return;
  }

  const octokit = await getOctokit(repository);
  const importComment = createGitHubImporter(octokit);
  await importComment(body.comment);
}

export { queue };
