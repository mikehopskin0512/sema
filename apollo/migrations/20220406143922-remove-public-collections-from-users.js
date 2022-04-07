module.exports = {
    async up(db) {
        const communityCollections = await db.collection('collections').find({ type: 'community' }).toArray();
        const communityCollectionIdSet = new Set(communityCollections.map(collection =>  collection._id.toString()));
        const users = await db.collection('users').find({ }).toArray();
        userIdList  = users.map(user =>  user._id)
        await Promise.all(users.map(async (user) => {
          const collectionsFiltered = user.collections.filter(
            (collection) => !( collection.isActive === false && communityCollectionIdSet.has(collection.collectionData.toString()) )
            );
          await db.collection('users').updateOne({ _id: user._id}, {$set: { collections: collectionsFiltered} });
        }));
    },
  
    async down() {
      //
    },
  };
  


