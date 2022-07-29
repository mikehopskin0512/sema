const mongoose = require('mongoose');
const { sortBy } = require('lodash');

const { Types: { ObjectId } } = mongoose;

const findInvalidUsers = (dupUsers) => {
  // find only one valid User
  let activeUserId = null;
  const activeUsers = dupUsers.filter(item => item.isActive && !item.isWaitlist && item.isOnboarded);
  if (activeUsers.length === 1) {
    activeUserId = activeUsers[0]._id;
  } else if (activeUsers.length > 1) {
    // sort by lastLogin
    const sortedByLastLogin = sortBy(activeUsers, (item) => item.lastLogin);
    activeUserId = sortedByLastLogin[sortedByLastLogin.length - 1]._id;
  } else {
    // it means no active user yet, so we will exclude only 1
    activeUserId = activeUsers[0]?._id;
  }
  
  if (!activeUsers || activeUsers.length === 0) {
    const syncUserIndex = dupUsers.findIndex(item => item.origin === 'sync');
    if (syncUserIndex > -1) {
      activeUserId = dupUsers[syncUserIndex]._id;
    }
  }
  
  return dupUsers.filter(dupUser => dupUser._id !== activeUserId);
}

const deleteDefaultCollectionForUser = async (db, userId) => {
  // find the default collection created for the user
  const defaultCollections = await db.collection('collections').find({ createdBy: userId, name: 'My Snippets' }).toArray();
  await Promise.all(defaultCollections.map(async (defaultCollection) => {
    // delete all snippets under My Snippets collection
    await db.collection('suggestedComments').deleteMany({ collectionId: defaultCollection._id });
  }));
  
  // delete the default collection created by the user
  await db.collection('collections').deleteMany({ createdBy: userId, name: 'My Snippets' });
}

const deleteUserRoleForUser = async (db, userId) => {
  // delete userRole mapping for the user
  await db.collection('userroles').deleteOne({ user: userId });
}

module.exports = {
  async up(db, client) {
    try {
      const dupUserAggregation = await db.collection('users').aggregate([
        {
          $group: {
            _id: "$username",
            ids: { $push: "$_id" },
            count: { $sum: 1 }
          },
        },
        {
          $match: {
            count: { $gt: 1 }
          },
        },
        {
          $project: {
            _id: false,
            dupUserIds: '$ids',
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "dupUserIds",
            foreignField: "_id",
            as: "dupUsers"
          }
        }
      ]).toArray();
      
      console.log(`__ ${dupUserAggregation.length} duplicated user sets`);
      // iterate the array of the duplicated user sets
      await Promise.all(dupUserAggregation.map(async (dupUserSet) => {
        // find and filter invalid users
        const usersToRemove = findInvalidUsers(dupUserSet.dupUsers || []);
        console.log(`__| Removing ${usersToRemove.length} users amount ${dupUserSet.dupUsers.length}...`);
        
        await Promise.all(usersToRemove.map(async (dupUser) => {
          // remove My Snippets collections and snippets of these invalid users
          await deleteDefaultCollectionForUser(db, dupUser._id);

          // remove userRole mapping for the user
          await deleteUserRoleForUser(db, dupUser._id);

          // remove the user itself
          await db.collection('users').deleteMany({ _id: new ObjectId(dupUser._id) });
          console.log(`____> Removed ${dupUser._id} : ${dupUser.handle}`);
        }));
      }));
      
    } catch (error) {
      console.log('error__', error);
    }
  },
  
  async down() {
    // No rollback needed
  }
};
