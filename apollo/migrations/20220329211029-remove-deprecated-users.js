const mongoose = require('mongoose');
const { sortBy } = require('lodash');

const { Types: { ObjectId } } = mongoose;

const deleteDefaultCollectionForUser = async (db, user) => {
  const userCollectionIds = user.collections ? user.collections.map(item => item.collectionData) : [];
  // find the default collection created for the user
  const defaultCollections = await db.collection('collections').find({ _id: { $in: userCollectionIds }, name: 'My Snippets' }).toArray();
  const defaultCollectionIds = defaultCollections ? defaultCollections.map(item => item._id) : [];
  // delete all snippets under My Snippets collection
  console.log(`-- -- deleting snippets for the collections for the user`);
  console.log(defaultCollectionIds);
  await db.collection('suggestedComments').deleteMany({ collectionId: { $in: defaultCollectionIds } });

  // delete the default collection created by the user
  await db.collection('collections').deleteMany({ _id: { $in: defaultCollectionIds }, name: 'My Snippets' });
}

const deleteUserRoleForUser = async (db, userId) => {
  // delete userRole mapping for the user
  await db.collection('userroles').deleteOne({ user: userId });
}

const deleteorganizationsForUser = async (db, userId) => {
  // find all default organizations created by the user
  const organizationsForUser = await db.collection('organizations').find({ createdBy: userId }).toArray();
  if (organizationsForUser && organizationsForUser.length > 0) {
    await Promise.all(organizationsForUser.map(async (organizationForUser) => {
      const organizationsCollectionIds = organizationForUser.collections ? organizationForUser.collections.map(item => item.collectionData) : [];
      const teamsDefaultCollections = await db.collection('collections').find({ _id: { $in: teamsCollectionIds }, name: `${teamForUser.name}'s Snippets` }).toArray();
      const defaultCollectionIds = teamsDefaultCollections ? teamsDefaultCollections.map(item => item._id) : [];
      // delete all snippets under My Snippets collection
      if (teamsDefaultCollections && teamsDefaultCollections.length > 0) {
        console.log(`-- deleting snippets for the collections for the user`);
        console.log(defaultCollectionIds);
        await db.collection('suggestedComments').deleteMany({ collectionId: { $in: defaultCollectionIds } });
      }
      // delete the team's collection
      await db.collection('collections').deleteMany({ _id: { $in: defaultCollectionIds } });
    }));
    // delete all teams created by the user
    await db.collection('teams').deleteMany({ createdBy: userId });
  }
}

module.exports = {
  async up(db, client) {
    const usersToRemove = [
      'james@semasoftware.com',
      'dave@semasoftware.com',
      'andrew.b@semalab.com',
      'abhishek@semasoftware.com',
      'jay@semasoftware.com',
      'matt@semasoftware.com',
    ]

    const users = await db.collection('users').find({ username: { $in: usersToRemove } }).toArray();

    await Promise.all(users.map(async (user) => {
      console.log(`processing ${user.username}`);
      // remove My Snippets collections and snippets of these invalid users
      console.log(`-- deleting default collection for the user`);
      await deleteDefaultCollectionForUser(db, user);

      // remove userRole mapping for the user
      console.log(`-- deleting userRole for the user`);
      await deleteUserRoleForUser(db, user._id);

      // remove teams created by these invalid users
      console.log(`-- deleting team created by the user`);
      await deleteTeamsForUser(db, user._id);

      // remove the user itself
      console.log(`-- deleting the user`);
      await db.collection('users').deleteOne({ _id: user._id });
    }));
  },

  async down(db, client) {
    // No
  }
};
