const mongoose = require('mongoose');

const { mongooseUri } = require('../src/config');

const { Types: { ObjectId } } = mongoose;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const Collections = await mongoose.connection.collection('collections').find({}).toArray();
    await Promise.all(Collections.map(async (collection) => {
      try {
        const commentCollection = collection.comments.map((_id) => (new ObjectId(_id)));
        const collectionSuggestedComments = await mongoose.connection.collection('suggestedComments').find({_id: {$in: commentCollection}}).toArray();
        const collectionSuggestedCommentsIds = collectionSuggestedComments.map(({ _id }) => _id );
        await mongoose.connection.collection('suggestedComments').updateMany({_id: {$in: collectionSuggestedCommentsIds}}, { $set: { collectionId: collection._id } })
      } catch(e) {
        console.log(e);
        next(error);
      }
    }));
  } catch (error) {
    console.log(error);
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const Collections = await mongoose.connection.collection('collections').find({}).toArray();
    await Promise.all(Collections.map(async (collection) => {
      try {
        const commentCollection = collection.comments.map((_id) => (new ObjectId(_id)));
        const collectionSuggestedComments = await mongoose.connection.collection('suggestedComments').find({_id: {$in: commentCollection}}).toArray();
        const collectionSuggestedCommentsIds = collectionSuggestedComments.map(({ _id }) => _id );
        await mongoose.connection.collection('suggestedComments').updateMany({_id: {$in: collectionSuggestedCommentsIds}}, { $unset: { collectionId: collection._id } })
      } catch(e) {
        console.log(e);
        next(error);
      }
    }));
  } catch (error) {
    console.log(error);
    next(error);
  }
  mongoose.connection.close();
};
