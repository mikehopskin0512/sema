module.exports = {
  async up(db) {
    function getUpdatedCollections(collections, communityCollectionsIds) {
      return collections.map((collection) => {
        const collectionId = collection.collectionData && collection.collectionData.toString();
        const isCommunityCollection = communityCollectionsIds.has(collectionId);
        return {
          ...collection,
          isActive: !isCommunityCollection,
        };
      });
    }

    async function updateCollections(collectionName, items, communityCollectionsIds) {
      await Promise.all(items.map(async (it) => {
        const collections = getUpdatedCollections(it.collections, communityCollectionsIds);
        await db
          .collection(collectionName)
          .findOneAndUpdate(
            { _id: it._id },
            { $set: { collections } },
          );
      }));
    }

    try {
      const communityCollections = await db
        .collection('collections')
        .find({ type: 'community' })
        .toArray();
      const users = await db
        .collection('users')
        .find({})
        .toArray();
      const organizations = await db
        .collection('organizations')
        .find({})
        .toArray();
      const communityCollectionsIds = new Set(communityCollections.map((collection) => collection._id.toString()));

      await updateCollections('users', users, communityCollectionsIds);
      await updateCollections('organizations', organizations, communityCollectionsIds);
    } catch (e) {
      console.log('error', e);
    }
  },

  async down() {
    // no needed
  },
};
