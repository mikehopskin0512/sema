require('../src/shared/mongo');
const assert = require('assert');

const {
  default: SmartComment,
} = require('../src/comments/smartComments/smartCommentModel');
const Snapshot = require('../src/snapshots/snapshotModel');
const { default: Repository } = require('../src/repositories/repositoryModel');

const { default: logger } = require('../src/shared/logger');

module.exports = {
  async up() {
    const commentsQuery = SmartComment.find({
      'source.id': null,
    });
    const count = await SmartComment.countDocuments(commentsQuery);
    const progress = createProgress();
    progress.plan(count);

    await commentsQuery.cursor().eachAsync(progress.wrap(migrateSmartComment), {
      parallel: 50,
      continueOnError: true,
    });
  },

  down() {
    return Promise.resolve();
  },
};

async function migrateSmartComment(smartComment) {
  try {
    await smartComment.save();
  } catch (error) {
    const isDuplicate = error.code === 11000;
    if (isDuplicate) {
      const other = await SmartComment.findOne(error.keyValue);
      logger.error(
        `Smart comment ${
          smartComment.id
        } (${smartComment.createdAt.toISOString()}) is a duplicate of ${
          other.id
        } (${other.createdAt.toISOString()})`
      );
      await handleDuplicates({ smartComment, other });
    } else logger.error(error.stack);
  }
}

async function handleDuplicates({ smartComment, other }) {
  await handleDuplicatesInSnapshots({ smartComment, other });
  await handleDuplicatesInRepositories({ smartComment, other });
  await smartComment.remove();
  logger.info(
    `Deleted smart comment ${smartComment.id} after cleaning up references`
  );
}

async function handleDuplicatesInRepositories({ smartComment, other }) {
  const filter = {
    'repoStats.reactions': {
      $elemMatch: { smartCommentId: smartComment._id },
    },
  };

  await Repository.collection.updateMany(filter, {
    $set: {
      'repoStats.reactions.$.smartCommentId': other._id,
    },
  });

  const count = await Repository.countDocuments(filter);
  assert(count === 0);
}

async function handleDuplicatesInSnapshots({ smartComment, other }) {
  await Snapshot.collection.updateMany(
    {
      'componentData.smartComments': {
        $elemMatch: { smartCommentId: smartComment._id },
      },
    },
    {
      $set: {
        'componentData.smartComments.$.smartCommentId': other._id,
      },
    }
  );

  const count = await Snapshot.countDocuments({
    'componentData.smartComments': {
      $elemMatch: { smartCommentId: smartComment._id },
    },
  });
  assert(count === 0);
}

function createProgress() {
  let processed = 0;
  let total = 0;
  let interval;

  const progress = {
    tick(count = 1) {
      processed += count;
    },
    plan(count) {
      total = count;
      logger.info(`Items to process: ${count}`);
      if (!interval) {
        interval = setInterval(() => {
          logger.info(`Progress: ${processed}/${total}`);
        }, 5000);
      }
    },
    wrap(fn) {
      return async (...args) => {
        try {
          await fn(...args);
        } finally {
          progress.tick();
        }
      };
    },
  };

  return progress;
}
