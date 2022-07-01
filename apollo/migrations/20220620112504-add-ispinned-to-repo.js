const mongoose = require('mongoose');

const { Types: { ObjectId } } = mongoose;

module.exports = {
  async up(db, client) {
    try {
      const users = await db.collection('users').find({}).toArray();
      const orgs = await db.collection('organizations').find({}).toArray();

      await Promise.all(users.map(async (user) => {
        await db.collection('users').findOneAndUpdate(
          { _id: new ObjectId(user._id) },
          { $set: {
            pinnedRepos: [],
          }}
        );
      }));

        await Promise.all(orgs.map(async (org) => {
          await db.collection('organizations').findOneAndUpdate(
            { _id: new ObjectId(org._id) },
            [
              {
                $addFields: {
                  pinnedRepos: [],
                }
              }
            ],
          );
      }));
    } catch (e) {
      console.error(e);
    }
  },

  async down(db, client) {
  }
};
