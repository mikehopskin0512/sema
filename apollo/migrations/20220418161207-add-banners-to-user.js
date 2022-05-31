const mongoose = require('mongoose');

const { Types: { ObjectId } } = mongoose;

module.exports = {
  async up(db, client) {
    try {
      const users = await db.collection('users').find({}).toArray();

      await Promise.all(users.map(async (user) => {
        await db.collection('users').findOneAndUpdate({ _id: new ObjectId(user._id) }, [
          {
            $addFields: {
              banners: {
                organizationCreate: true
              }
            }
          }
        ]);
      }));
    } catch (e) {
      console.log(e)
    }
  },

  async down(db, client) {
    try {
      const users = await db.collection('users').find({}).toArray();

      await Promise.all(users.map(async (user) => {
        await db.collection('users').findOneAndUpdate({ _id: new ObjectId(user._id) },
          {
            $unset: {
              banners: "",
            }
          }
        );
      }));
    } catch (e) {
      console.log(e)
    }
  }
};
