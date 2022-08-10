import ms from 'ms';
import SmartComment from './smartCommentModel';
import { findOneByTitle as findReactionByTitle } from '../reaction/reactionService';
import { findOneByLabel as findTagByLabel } from '../tags/tagService';
import { getTags, getSummaries } from '../../shared/apiJaxon';
import logger from '../../shared/logger';

export const schedule = '1m';

export default async function analyzeComments() {
  // Prevent concurrent runs of this job by processing
  // for a maximum of 50 seconds at a time.
  // At the 50 second mark, the signal will be aborted
  // and the process will halt with no errors.
  // The next run of this scheduled job will pick up
  // where it left off.
  const timeout = ms(schedule) - ms('10s');

  await withGracefulTimeout(timeout, async ({ signal }) => {
    // Querying by $type allows us to use a partial index.
    await SmartComment.find({
      'analyzedAt': { $type: 'null' },
      'source.origin': 'sync',
    })
      .cursor()
      .eachAsync(
        async (comment) => {
          if (signal.aborted) throw new Error('AbortError');
          try {
            await analyzeComment(comment);
            logger.info(`Analyzed comment ${comment._id}`);
          } catch (error) {
            logger.error(error);
          }
        },
        {
          parallel: 50,
        }
      );
  });
}

async function analyzeComment(comment) {
  const text = comment.comment;
  const textTags = await getTags(text);
  const tags = await Promise.all(
    textTags.map((tag) => findTagByLabel(tag, 'smartComment'))
  );
  const [textReaction] = await getSummaries(text);
  const reaction = textReaction
    ? await findReactionByTitle(textReaction)
    : null;
  comment.set({
    tags,
    reaction: reaction || comment.reaction,
    analyzedAt: new Date(),
  });
  await comment.save();
}

async function withGracefulTimeout(timeout, fn) {
  const signal = AbortSignal.timeout(timeout);

  try {
    await fn({ signal });
  } catch (error) {
    if (error.message !== 'AbortError') throw error;
  }
}
