import logger from '../shared/logger';
import { queues } from '../queues';

const queue = queues.self(module);

export default async function githubWebhook({ id }) {
  logger.info(`${queue.name} processing payload ${id}`);
}

export { queue };
