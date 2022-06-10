module.exports = {
    async up(db) {
        const communityCollections = await db.collection('collections').find({ type: 'organization' }).toArray();
        const communityCollectionIdSet = new Set(communityCollections.map(collection =>  collection._id.toString()));
        const organizations = await db.collection('organizations').find({ }).toArray();

        await Promise.all(organizations.map(async (organization) => {
          const collectionsFiltered = organization.collections.filter((collection) => collection.collectionData && communityCollectionIdSet.has(collection.collectionData.toString()));
          await db.collection('organizations').updateOne({ _id: organization._id}, {$set: { collections: collectionsFiltered} });
        }));
    },

    async down() {
      //
    },
  };
