const mongoose = require('mongoose');

const { Types: { ObjectId } } = mongoose;

module.exports = {
  async up(db) {
    const philosophiesCollection = await db.collection('collections').findOne({ type: 'community', name: 'Philosophies' });
    if(!philosophiesCollection) return;

    const philosophiesCollectionId = philosophiesCollection._id;
    await db.collection('collections').updateOne({ _id: philosophiesCollectionId }, { $set: { isActiveByDefault: true } });

    const users = await db.collection('users').find({}).toArray();
    await Promise.all(users.map(async (user) => {
      const collections = user.collections.filter((collection) => !collection.collectionData.equals(philosophiesCollectionId));

      await db.collection('users').updateOne({ _id: user._id }, {
        $set: {
          collections: [...collections, {
            collectionData: new ObjectId(philosophiesCollectionId),
            isActive: true,
            _id: new ObjectId(),
          }]
        }
      });
    }));

    const organizations = await db.collection('organizations').find({}).toArray();

    await Promise.all(organizations.map(async (organization) => {
      const collections = organization.collections.filter((collection) => !collection.collectionData.equals(philosophiesCollectionId));

      await db.collection('organizations').updateOne({ _id: organization._id }, {
        $set: {
          collections: [...collections, {
            collectionData: new ObjectId(philosophiesCollectionId),
            isActive: true,
            _id: new ObjectId(),
          }]
        }
      });
    }))
  },

  async down() {
    //
  },
};
