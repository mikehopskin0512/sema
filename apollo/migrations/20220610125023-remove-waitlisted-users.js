module.exports = {
  async up(db) {
    await db.collection('users')
      .updateMany({ isWaitlist: true }, { $set: { isWaitlist: false } });
  },

  async down(db, client) {
  },
};
