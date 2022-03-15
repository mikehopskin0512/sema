const mongoose = require('mongoose');
const fs = require('fs');
const data = require('../data/collections');

const { mongooseUri } = require('../src/config');

const { Types: { ObjectId } } = mongoose;

const collectionsIds = data.map(({ _id }) => new ObjectId(_id));

const collectionsData = data.map(({
  _id, name, description, tags, comments, author, isActive,
}) => {
  const collection = { name, description, tags, comments, author, isActive };
  if (_id) {
    collection._id = new ObjectId(_id);
  }

  collection.tags = tags.map(({ tag, type, label }) => ({ tag: new ObjectId(tag), type, label }));
  collection.comments = comments.map((commentId) => (new ObjectId(commentId)));
  return collection;
});

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const colCollections = mongoose.connection.db.collection('collections');
    const collections = await colCollections.insertMany(collectionsData);
    fs.writeFileSync(`${process.cwd()}/data/collections.json`, JSON.stringify(collections.ops));
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const colCollections = mongoose.connection.db.collection('collections');
    await colCollections.deleteMany({ _id: { $in: collectionsIds } });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};
