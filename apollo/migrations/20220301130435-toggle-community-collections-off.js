const mongoose = require('mongoose');
const { log } = require('debug');

module.exports = {
  async up(db) {
    const mongooseUri = 'mongodb+srv://phoenix_admin:DnUKm3vsf3C3zaym@sema-cluster.tpplx.mongodb.net/phoenix_qa?authSource=admin&replicaSet=atlas-bjp57o-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
    const options = {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    };
    await mongoose.connect(mongooseUri, options);

    function getUpdateUserCollections(collections, communityCollectionsIds) {
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
      const communityCollections = await mongoose.connection.db
        .collection('collections')
        .find({ type: 'community' })
        .toArray();
      const users = await mongoose.connection.db
        .collection('users')
        .find({})
        .toArray();
      const communityCollectionsIds = new Set(communityCollections.map((collection) => collection._id.toString()));

      await Promise.all(users.map(async (user) => {
        const collections = getUpdateUserCollections(user.collections, communityCollectionsIds);
        await mongoose.connection.db.collection('users').findOneAndUpdate(
          { _id: user._id },
          { $set: { collections } },
        );
      }));
    } catch (e) {
      console.log('error', e);
    }
  },

  async down(db) {
    //
  },
};

// main.up();
