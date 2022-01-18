const _ = require('lodash');
const mongoose = require('mongoose');

const { mongooseUri } = require('../src/config');

const options = { useUnifiedTopology: true, useNewUrlParser: true };
const { Types: { ObjectId } } = mongoose;

module.exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const collectionsModel = mongoose.connection.collection('collections');
    const archivedCollections = await collectionsModel.find({ name: 'Archived' }).toArray();
    const archivedCollectionsIds = archivedCollections.map(({ _id }) => (_id.toString()));

    const userModel = mongoose.connection.collection('users');
    const users = await userModel.find({}).toArray();

    await Promise.all(users.map(async (user) => {
      const uniqueCollections = _.uniqBy(user.collections, (e) => (e.collectionData ? e.collectionData.toString() : null));
      const sanitizedCollections = uniqueCollections
        .flatMap(({ _id, collectionData, isActive }) => (archivedCollectionsIds.includes(collectionData ? collectionData.toString() : '')
            ? [] : [{ _id: new ObjectId(_id), collectionData: new ObjectId(collectionData), isActive }]
        ));

      await userModel.findOneAndUpdate({ _id: new ObjectId(user._id) }, { $set: { collections: sanitizedCollections } });
    }));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.down = async (next) => {
};
