module.exports = {
    async up(db) {
        const communityCollections = await db.collection('collections').find({ type: 'community' }).toArray();
        const communityCollectionIdSet = new Set(communityCollections.map(collection =>  collection._id.toString()));
        const teams = await db.collection('teams').find({ }).toArray();

        await Promise.all(teams.map(async (team) => {
            const collectionsFiltered = team.collections.filter(
              (collection) => {
                if(!collection.collectionData) {
                  return false;
                }

                return !( collection.isActive === false && communityCollectionIdSet.has(collection.collectionData.toString()));
              });
            await db.collection('teams').updateOne({ _id: team._id}, {$set: { collections: collectionsFiltered} });
        }));
    },
  
    async down() {
      //
    },
  };
  