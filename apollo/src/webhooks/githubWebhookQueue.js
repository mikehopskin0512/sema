import logger from '../shared/logger';
import { queues } from '../queues';
import Repository from '../repositories/repositoryModel';
import createGitHubImporter from '../repoSync/github';
import { getOctokit } from '../repoSync/repoSyncService';

const queue = queues.self(module);

export default async function githubWebhook(body) {
  const repository = await Repository.findOne({
    type: 'github',
    externalId: body.repository.id.toString(),
  });
  const isRepoSyncSupported = repository.type === 'github';
  if (!isRepoSyncSupported) {
    logger.error(
      `Repo sync: Skipping repo sync for repository ${body.repository.id}, type is ${repository.type}`
    );
    return;
  }

  const comment = body.comment || body.review;
  if (!comment) {
    logger.error('Repo sync: No comment or review found in webhook payload');
    return;
  }

  repository.cloneUrl = body.repository.clone_url;
  await repository.save();

  const octokit = await getOctokit(repository);
  const importComment = createGitHubImporter(octokit);
  await importComment(comment);
}

export { queue };
