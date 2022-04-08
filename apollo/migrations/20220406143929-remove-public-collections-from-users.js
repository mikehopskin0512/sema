module.exports = {
    async up(db) {
        const communityCollections = await db.collection('collections').find({ type: 'community' }).toArray();
        const communityCollectionIdSet = new Set(communityCollections.map(collection =>  collection._id.toString()));
        const users = await db.collection('users').find({ }).toArray();

        await Promise.all(users.map(async (user) => {
          await db.collection('users').updateOne({ _id: user._id}, {$set: { collectionsBackup: user.collections} });
          const collectionsFiltered = user.collections.filter((collection) => collection.collectionData && !communityCollectionIdSet.has(collection.collectionData.toString()));
          if(collectionsFiltered.length >= 1) {
            await db.collection('users').updateOne({ _id: user._id}, {$set: { collections: collectionsFiltered} });
            console.log('=============', user._id, ':::', collectionsFiltered.length)
          } else {
            console.log('up -> collectionsFiltered.length', user._id, collectionsFiltered.length)
          }
        }));
    },
  
    async down() {
      //
    },
  };
  
