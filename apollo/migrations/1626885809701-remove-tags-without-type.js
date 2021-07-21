const mongoose = require('mongoose');
const fs = require('fs');
const data = require('../data/tags');

// Note this is mostly the same script as 1618495619497-add-tags.js
// except we switched the up and down methods.
// When you call this script migrate up -> it will remove the old tags

const { mongooseUri } = require('../src/config');

const { Types: { ObjectId } } = mongoose;

const tagsIds = data.map(({ _id }) => new ObjectId(_id));

const tagsData = data.map(({
  _id, type, label, sentiment, isActive,
}) => {
  const tag = { type, label, sentiment, isActive };
  if (_id) {
    tag._id = new ObjectId(_id);
  }
  return tag;
});

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const colTags = mongoose.connection.db.collection('tags');
    const tags = await colTags.insertMany(tagsData);
//    fs.writeFileSync(`${process.cwd()}/data/tags.json`, JSON.stringify(tags.ops));
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const colTags = mongoose.connection.db.collection('tags');
    await colTags.deleteMany({ _id: { $in: tagsIds } });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};
