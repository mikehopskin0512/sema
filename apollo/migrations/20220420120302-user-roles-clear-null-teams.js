module.exports = {
  async up(db) {
    await db.collection('userroles').deleteMany({ organization: null });
  },

  async down() {
    //
  },
};
