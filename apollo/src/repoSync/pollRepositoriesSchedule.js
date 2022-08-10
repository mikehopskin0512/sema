import Repository from '../repositories/repositoryModel';
import { queue as pollRepositoryQueue } from './pollRepositoryQueue';
import { getOctokitForRepository } from './repoSyncService';

export default async function pollRepositories() {
  await Repository.find({ 'sync.status': 'completed' })
    .select({ repoStats: 0 })
    .cursor()
    .eachAsync(
      async (repository) => {
        const needsPolling = !(await getOctokitForRepository(repository));
        if (needsPolling)
          await pollRepositoryQueue.queueJob({ id: repository.id });
      },
      { parallel: 20 }
    );
}

export const schedule = '15m';
