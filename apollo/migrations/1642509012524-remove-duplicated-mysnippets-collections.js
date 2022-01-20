const mongoose = require('mongoose');

const { mongooseUri } = require('../src/config');

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const { Types: { ObjectId } } = mongoose;

module.exports.up = async (next) => {
  try {
    await mongoose.connect(mongooseUri, options);

    const collectionsModel = mongoose.connection.collection('collections');
    const mySnippetsCollections = await collectionsModel.find({ name: 'My Snippets' }).toArray();
    const mySnippetsCollectionsIds = mySnippetsCollections.map(({ _id }) => (_id.toString()));

    const userModel = mongoose.connection.collection('users');
    const users = await userModel.find({}).toArray();

    const collectionIdsForDelete = [];

    await Promise.all(users.map(async (user) => {
      const currentMySnippetsCollectionIds = user.collections
        .filter(({ collectionData }) => mySnippetsCollectionsIds.includes(collectionData.toString()))
        .map(({ collectionData }) => collectionData.toString());
      
      let currentCollectionIdForSave;

      const currentCollections = mySnippetsCollections.filter((collection) => currentMySnippetsCollectionIds.includes(collection._id.toString()));
      currentCollections.map((collection, index) => {
        if(!currentCollectionIdForSave && (collection.comments.length || index === currentCollections.length - 1)) {
          currentCollectionIdForSave = collection._id.toString();
        } else {
          collectionIdsForDelete.push(collection._id);
        }
      });

      const sanitizedCollections = user.collections.filter(({ collectionData }) => !currentMySnippetsCollectionIds.includes(collectionData.toString()));
      const collectionForSave = user.collections.filter(({ collectionData }) => collectionData.toString() === currentCollectionIdForSave)[0];
      sanitizedCollections.push(collectionForSave);

      await userModel.findOneAndUpdate({ _id: new ObjectId(user._id) }, { $set: { collections: sanitizedCollections } });

    }));

    await collectionsModel.deleteMany({ _id: { $in: collectionIdsForDelete } });
  } catch (e) {
    next(e);
  }
}

module.exports.down = function (next) {
  next()
}
