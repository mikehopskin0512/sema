module.exports = {
  async up(db) {
    function getUpdatedUserCollections(collections, communityCollectionsIds) {
      return collections.map((collection) => {
        const collectionId = collection.collectionData && collection.collectionData.toString();
        const isCommunityCollection = communityCollectionsIds.has(collectionId);
        return {
          ...collection,
          isActive: !isCommunityCollection,
        };
      });
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
      const communityCollectionsIds = new Set(communityCollections.map((collection) => collection._id.toString()));

      await Promise.all(users.map(async (user) => {
        const collections = getUpdatedUserCollections(user.collections, communityCollectionsIds);
        await db
          .collection('users')
          .findOneAndUpdate(
            { _id: user._id },
            { $set: { collections } },
          );
      }));
    } catch (e) {
      console.log('error', e);
    }
  },

  async down() {
    // no needed
  },
};
