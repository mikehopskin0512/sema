import Bluebird from 'bluebird';
import Repository from '../repositories/repositoryModel';
import { queue as pollRepositoryQueue } from './pollRepositoryQueue';
import { getOctokitForRepository } from './repoSyncService';

export default async function pollRepositories() {
  await Bluebird.resolve(getRepositoriesWithNoInstallation()).map(
    async (repository) =>
      await pollRepositoryQueue.queueJob({ id: repository.id }),
    { concurrency: 10 }
  );
}

export const schedule = '15m';

// TODO: In the future there may be a more efficient
// way of getting a list of repositories that have
// not installed the Sema app.
async function getRepositoriesWithNoInstallation() {
  return await Bluebird.resolve(
    Repository.find({ 'sync.status': 'completed' })
  ).filter(async (repository) => !(await getOctokitForRepository(repository)), {
    concurrency: 10,
  });
}
