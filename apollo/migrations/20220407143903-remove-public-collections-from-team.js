module.exports = {
    async up(db) {
        const communityCollections = await db.collection('collections').find({ type: 'community' }).toArray();
        const communityCollectionIdSet = new Set(communityCollections.map(collection =>  collection._id.toString()));
        const teams = await db.collection('teams').find({ }).toArray();

        await Promise.all(teams.map(async (team) => {
          await db.collection('teams').updateOne({ _id: team._id}, {$set: { collectionsBackup: team.collections} });
          const collectionsFiltered = team.collections.filter((collection) => collection.collectionData && !communityCollectionIdSet.has(collection.collectionData.toString()));
          if(collectionsFiltered.length >= 1) {
            await db.collection('teams').updateOne({ _id: team._id}, {$set: { collections: collectionsFiltered} });
            console.log('=============', team._id, ':::', collectionsFiltered.length)
          } else {
            console.log('up -> collectionsFiltered.length', team._id, collectionsFiltered.length)
          }
        }));
    },
  
    async down() {
      //
    },
  };
  