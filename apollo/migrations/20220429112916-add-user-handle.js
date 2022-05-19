const mongoose = require('mongoose');

const { Types: { ObjectId } } = mongoose;

module.exports = {
  async up(db, client) {
    const users = await db.collection('users').find().toArray();
    await Promise.all(users.map(async (user) => {
      const { identities } = user;
      console.log(user);
      const { username } = identities.length && identities.find((item) => item?.provider === 'github');
      await db.collection('users').findOneAndUpdate(
        { _id: new ObjectId(user._id) },
        [
          {
            $addFields: {
              handle: username,
            }
          }
        ]
      );
    }));
  },

  async down(db, client) {
    try {
      const users = await db.collection('users').find({}).toArray();

      await Promise.all(users.map(async (user) => {
        await db.collection('users').findOneAndUpdate({ _id: new ObjectId(user._id) },
          {
            $unset: {
              handle: "",
            }
          }
        );
      }));
    } catch (e) {
      console.log(e)
    }
  }
};
