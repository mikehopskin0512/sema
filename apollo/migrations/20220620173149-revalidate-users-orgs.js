const mongoose = require('mongoose');

const { Types: { ObjectId } } = mongoose;

module.exports = {
  async up(db) {
    const users = await db.collection('users').find().toArray();
    await Promise.all(users.map(async (user) => {
      const { organizations } = user;

      const updatedOrgs = organizations.filter(org => typeof org.id === 'object');

      await db.collection('users').findOneAndUpdate(
        { _id: new ObjectId(user._id) },
        { $set: {
            organizations: updatedOrgs ?? []
          }}
      );
    }));
  },

  async down(db, client) {}
};
