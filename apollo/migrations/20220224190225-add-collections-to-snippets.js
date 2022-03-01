module.exports = {
  async up(db) {
    try {
      const snippets = await db.collection('suggestedComments').find({}).toArray();

      await Promise.all(snippets.map(async (snippet) => {
        let collections = await db.collection('collections').find({ comments: snippet._id }).toArray();
        collections = collections.map(({ _id, name }) => ({ collectionId: _id, name }));
        await db.collection('suggestedComments').updateOne({ _id: snippet._id }, { $set: { collections } }, { upsert: true });
      }));
    } catch (error) {
      console.log('error___', error);
    }
  },

  async down(db) {
    await db.collection('suggestedComments').updateMany({}, { $unset: { collections: [] } });
  },
};
