module.exports = {
  async up(db, client) {
    /*
      This will delete all userroles that has deleted users.
    */
    const userroles = await db.collection('userroles').find({}).toArray();
    await Promise.all (userroles.map(async (userrole) => {
      const user = await db.collection('users').findOne({ _id: userrole.user }).toArray();
      if (!user) {
        await db.collection('userroles').deleteOne({ _id: userrole._id });
      }
    }))
  },

  async down(db, client) {

  }
};
