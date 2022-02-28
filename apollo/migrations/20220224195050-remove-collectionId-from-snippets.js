module.exports = {
  async up(db) {
    await db.collection('suggestedComments').updateMany({}, { $unset: { collectionId: '' } });
  },

  async down(db) {
    // No rollback needed
  },
};
