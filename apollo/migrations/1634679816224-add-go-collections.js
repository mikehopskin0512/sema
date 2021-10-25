const mongoose = require('mongoose');

const { mongooseUri } = require('../src/config');

const { Types: { ObjectId } } = mongoose;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const golangCollections = [
  { "collectionData" : new ObjectId("613b974394340b2a26f1023a"), "isActive" : true },
  { "collectionData" : new ObjectId("613b974394340b2a26f1023c"), "isActive" : true }
];

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    await mongoose.connection
      .collection('users')
      .updateMany(
        {},
        { $addToSet: { collections:  { $each: golangCollections } } },
      );
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
};
