module.exports = {
  async up(db) {
    await db.collection('userroles').deleteMany({ team: null });
  },

  async down() {
    //
  },
};