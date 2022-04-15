module.exports = {
    async up(db) {
        const communityCollections = await db.collection('collections').find({ type: 'community' }).toArray();
        const communityCollectionIdSet = new Set(communityCollections.map(collection =>  collection._id.toString()));
        const users = await db.collection('users').find({ }).toArray();

        await Promise.all(users.map(async (user) => {
          const collectionsFiltered = user.collections.filter((collection) => collection.collectionData && !communityCollectionIdSet.has(collection.collectionData.toString()));
          await db.collection('users').updateOne({ _id: user._id}, {$set: { collections: collectionsFiltered} });
        }));
    },
  
    async down() {
      //
    },
  };
  
