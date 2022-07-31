/* eslint-disable no-await-in-loop */

const { sortBy } = require('lodash');
const { default: logger } = require('../src/shared/logger');

const findUsersToDelete = (dupUsers) => {
  const activeUser = sortBy(dupUsers, (item) => item.lastLogin)
    .reverse()
    .find((item) => item.isActive && !item.isWaitlist && item.isOnboarded);

  const userToKeep = activeUser || dupUsers[0];
  const usersToDelete = dupUsers.filter(
    (user) => !user._id.equals(userToKeep._id)
  );
  return [userToKeep, usersToDelete];
};

const deleteDefaultCollectionForUsers = async (db, userIds) => {
  // find the default collection created for the user
  const defaultCollectionIds = await db
    .collection('collections')
    .find({ createdBy: { $in: userIds }, name: 'My Snippets' })
    .toArray();

  await db
    .collection('suggestedComments')
    .deleteMany({ collectionId: { $in: defaultCollectionIds } });

  // delete the default collection created by the user
  await db
    .collection('collections')
    .deleteMany({ _id: { $in: defaultCollectionIds } });
};

async function processDuplicateUsers(db, users) {
  const [userToKeep, usersToDelete] = findUsersToDelete(users);
  const userIdsToDelete = usersToDelete.map((user) => user._id);

  logger.info(
    `${userToKeep.handle}: User to keep: ${
      userToKeep._id
    }, deleting ${userIdsToDelete.join(', ')}`
  );

  await deleteDefaultCollectionForUsers(db, userIdsToDelete);

  await db
    .collection('userroles')
    .updateMany(
      { user: { $in: userIdsToDelete } },
      { $set: { user: userToKeep._id } }
    );

  await db
    .collection('smartComments')
    .updateMany(
      { userId: { $in: userIdsToDelete } },
      { $set: { userId: userToKeep._id } }
    );

  await db
    .collection('collections')
    .updateMany(
      { createdBy: { $in: userIdsToDelete } },
      { $set: { createdBy: userToKeep._id } }
    );

  await db
    .collection('repositories')
    .updateMany(
      {},
      { $pull: { 'repoStats.userIds': { $in: userIdsToDelete } } }
    );

  await db.collection('snapshots').updateMany(
    {
      'componentData.smartComments': {
        $elemMatch: { userId: { $in: userIdsToDelete } },
      },
    },
    {
      $set: {
        'componentData.smartComments.$.userId': userToKeep._id,
      },
    }
  );

  await db.collection('users').deleteMany({ _id: { $in: userIdsToDelete } });
}

module.exports = {
  async up(db) {
    const duplicateUsers = await db.collection('users').aggregate([
      {
        $group: {
          _id: { provider: '$identities.provider', id: '$identities.id' },
          ids: { $push: '$_id' },
          handle: { $first: '$handle' },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
      {
        $sort: { handle: 1 },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'ids',
          foreignField: '_id',
          as: 'users',
        },
      },
    ]);

    while (await duplicateUsers.hasNext()) {
      const { users } = await duplicateUsers.next();
      await processDuplicateUsers(db, users);
    }
  },

  async down() {
    // No rollback needed
  },
};
