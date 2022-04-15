module.exports = {
  async up(db, client) {
    /*
      This will delete all userroles that has deleted users.
    */
    const userroles = await db.collection('userroles').find({}).toArray();
    const usersCollection = db.collection('users')
    await Promise.all (userroles.map(async (userrole) => {
      const user = usersCollection.findOne({ _id: userrole.user }).toArray();
      if (!user) {
        await db.collection('userroles').deleteOne({ _id: userrole._id });
      }
    }))
  },

  async down(db, client) {

  }
};
