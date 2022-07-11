const mongoose = require('mongoose');

const { Types: { ObjectId } } = mongoose;

module.exports = {
  async up(db) {
    const users = await db.collection('users').find().toArray();
    await Promise.all(users.map(async (user) => {
      const userOnBoardingStatus = user.isFastForwardOnboarding;

      await db.collection('users').findOneAndUpdate(
        { _id: new ObjectId(user._id) },
        { $set: {
            isFastForwardOnboarding: userOnBoardingStatus ?? false
          }}
      );
    }));

  },

  async down(db, client) {}
};
