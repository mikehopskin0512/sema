const mongoose = require('mongoose');
const fs = require('fs');
const data = require('../data/reactions');

const { mongooseUri } = require('../src/config');

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

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
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
  await mongoose.connect(mongooseUri, options);
  try {
    const colReactions = mongoose.connection.db.collection('reactions');
    await colReactions.deleteMany({ _id: { $in: reactionsIds } });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};
