const mongoose = require('mongoose');

const { Types: { ObjectId } } = mongoose;

module.exports = {
  async up(db, client) {
    try {
      const repositories = await db.collection('repositories').find({}).toArray();

      await Promise.all(repositories.map(async (repo) => {
        await db.collection('repositories').findOneAndUpdate(
          { _id: new ObjectId(repo._id) },
          [
            {
              $addFields: {
                isPinned: false,
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
