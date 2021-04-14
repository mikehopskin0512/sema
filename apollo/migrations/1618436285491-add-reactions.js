const mongoose = require('mongoose');
const fs = require('fs');
const data = require('../data/reactions');

const { mongooseUri, mongooseUriLocal, mongooseCertPath } = require('../src/config');

const uri = mongooseUriLocal !== '' ? mongooseUriLocal : mongooseUri;

const { Types: { ObjectId } } = mongoose;

const reactionsIds = data.map(({ _id }) => new ObjectId(_id));

const reactionsData = data.map(({
  _id, title, emoji, githubEmoji, isActive,
}) => {
  const reaction = { title, emoji, githubEmoji, isActive };
  if (_id) {
    reaction._id = new ObjectId(_id);
  }
  return reaction;
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
    const colReactions = mongoose.connection.db.collection('reactions');
    const reactions = await colReactions.insertMany(reactionsData);
    fs.writeFileSync(`${process.cwd()}/data/reactions.json`, JSON.stringify(reactions.ops));
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(uri, options);
  try {
    const colReactions = mongoose.connection.db.collection('reactions');
    await colReactions.deleteMany({ _id: { $in: reactionsIds } });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};
