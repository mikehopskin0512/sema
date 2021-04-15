const mongoose = require('mongoose');
const fs = require('fs');
const data = require('../data/tags');

const { mongooseUri, mongooseUriLocal, mongooseCertPath } = require('../src/config');

const uri = mongooseUriLocal !== '' ? mongooseUriLocal : mongooseUri;

const { Types: { ObjectId } } = mongoose;

const tagsIds = data.map(({ _id }) => new ObjectId(_id));

const tagsData = data.map(({
  _id, label, sentiment, isActive,
}) => {
  const tag = { label, sentiment, isActive };
  if (_id) {
    tag._id = new ObjectId(_id);
  }
  return tag;
});

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

if (mongooseCertPath) { 
  const ca = [fs.readFileSync(process.cwd() + mongooseCertPath)];
  options.mongos.sslCA = ca;
  options.mongos.ca = ca;
}

exports.up = async (next) => {
  await mongoose.connect(uri, options);
  try {
    const colTags = mongoose.connection.db.collection('tags');
    const tags = await colTags.insertMany(tagsData);
    fs.writeFileSync(`${process.cwd()}/data/tags.json`, JSON.stringify(tags.ops));
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(uri, options);
  try {
    const colTags = mongoose.connection.db.collection('tags');
    await colTags.deleteMany({ _id: { $in: tagsIds } });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};
