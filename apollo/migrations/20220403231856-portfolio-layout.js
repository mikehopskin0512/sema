module.exports = {
  async up(db) {
    try {
      await db.collection('portfolios').updateMany({}, { $set: { layout: [] } });
    } catch (error) {
      console.log('error__', error);
    }
  },

  async down(db, client) {
  }
};
