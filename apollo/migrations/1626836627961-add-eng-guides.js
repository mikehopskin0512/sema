const mongoose = require('mongoose');
const fs = require('fs');
const data = require('../data/engGuides');

const { mongooseUri } = require('../src/config');

const { Types: { ObjectId } } = mongoose;

const engGuidesIds = data.map(({ _id }) => new ObjectId(_id));

const engGuidesData = data.map(({
  _id, displayId, title, slug, body, author, source, collections, tags, isActive,
}) => {
  const engGuide = { displayId, title, slug, body, author, source, collections, tags, isActive };
  if (_id) {
    engGuide._id = new ObjectId(_id);
  }

  engGuide.tags = tags.map(({ tag, type, label }) => ({ tag: new ObjectId(tag), type, label }));
  engGuide.collections = collections.map((collection) => (new ObjectId(collection)));
  return engGuide;
});

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const colEngGuides = mongoose.connection.db.collection('engGuides');
    const engGuides = await colEngGuides.insertMany(engGuidesData);
    fs.writeFileSync(`${process.cwd()}/data/engGuides.json`, JSON.stringify(engGuides.ops));
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const colEngGuides = mongoose.connection.db.collection('engGuides');
    await colEngGuides.deleteMany({ _id: { $in: engGuidesIds } });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};
