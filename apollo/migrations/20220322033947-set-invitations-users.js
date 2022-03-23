module.exports = {
  async up(db) {
    try {
      await db.collection('users').updateMany({ isActive: true }, { $set: { inviteCount: 10 } }, { upsert: true });
    } catch (error) {
      console.log('error__', error);
    }
  },

  async down() {
    // No rollback needed
  },
};
