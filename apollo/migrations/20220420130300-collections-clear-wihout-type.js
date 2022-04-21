module.exports = {
  async up(db) {
    await db.collection('collections').deleteMany({ type: null });
  },

  async down() {
    //
  },
};