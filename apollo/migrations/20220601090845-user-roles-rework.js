const mongoose = require('mongoose');

const { Types: { ObjectId } } = mongoose;

module.exports = {
  async up(db) {
    try {
      const userRoles = await db.collection('userroles')
        .find({})
        .toArray();
      await Promise.all(userRoles.map(async (role) => {
        await db.collection('userroles')
          .findOneAndUpdate({ _id: new ObjectId(role._id) }, {
            $set: { organization: role.team },
            $unset: { team: null },
          });
      }));

    } catch (e) {
      console.log(e);
    }
  },

  async down(db, client) {
  },
};
