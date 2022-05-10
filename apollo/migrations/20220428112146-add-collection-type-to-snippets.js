module.exports = {
  async up(db) {
    const collections = await db.collection('collections').find({}).toArray();
    const collectionTypeById = new Map(collections.map(({ _id, type }) => [_id.toString(), type]));
    const snippets = await db.collection('suggestedComments').find({}).toArray();
    await Promise.all(snippets.map((snippet) => {
      const typedCollections = snippet.collections.map((collection) => ({
        ...collection,
        type: collectionTypeById.get(collection.collectionId.toString()),
      }));
      return db.collection('suggestedComments').findOneAndUpdate(
        { _id: snippet._id },
        { $set: { collections: typedCollections } },
      );
    }));
  },

  async down() {
    //
  },
};
