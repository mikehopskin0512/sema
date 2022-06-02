const mongoose = require('mongoose');

const { Types: { ObjectId } } = mongoose;

module.exports = {
  async up(db) {
    const updateCollections = async (collection, communityCollections) => {
      const modelCollections = await db.collection(collection).aggregate([{ $addFields: { collections: { $reduce: {
        input: communityCollections,
        initialValue: '$collections',
        in: {
          $cond: [{ $in: ['$$this.collectionData', '$collections.collectionData'] }, '$$value', { $concatArrays: [['$$this'], '$$value'] }],
        },
      } } } }, { $project: {
        _id: 1,
        collections: 1,
      } }]).toArray();

      await Promise.all(modelCollections.map(async ({ _id, collections }) => {
        await db.collection(collection).findOneAndUpdate(
          { _id: new ObjectId(_id) }, { $set: { collections } }, { upsert: true },
        );
      }));
    };

    try {
      // -- Sema Community Collections
      const [semaOrganization] = await db.collection('organizations').find({ name: 'Sema Corporate Organization' }).toArray();
      const communityCollections = semaOrganization.collections.map(({ _id, collectionData }) => ({ collectionData: new ObjectId(collectionData), _id, isActive: true }));

      // -- Personal Snippets Users
      await updateCollections('users', communityCollections);

      // -- Organizations
      await updateCollections('organizations', communityCollections);
    } catch (e) {
      console.log('error__', e);
    }
  },

  async down(db) {
    // No rollback needed
  },
};
