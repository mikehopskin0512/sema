const mongoose = require('mongoose');
const fs = require('fs');
const data = require('../data/commentBank');

const { mongooseUri, mongooseCertPath } = require('../src/config');

const { Types: { ObjectId } } = mongoose;

const suggestedCommentsIds = data.map(({ _id }) => new ObjectId(_id));

const suggestedCommentsData = data.map(({
  _id, comment, sourceName, sourceUrl, title,
}) => {
  const suggestedComment = { comment, sourceName, sourceUrl, title };
  if (_id) {
    suggestedComment._id = new ObjectId(_id);
  }
  return suggestedComment;
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
  await mongoose.connect(mongooseUri, options);
  try {
    const colComments = mongoose.connection.db.collection('suggestedComments');
    const suggestedComments = await colComments.insertMany(suggestedCommentsData);
    fs.writeFileSync(`${process.cwd()}/data/commentBank.json`, JSON.stringify(suggestedComments.ops));
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const colComments = mongoose.connection.db.collection('suggestedComments');
    await colComments.deleteMany({ _id: { $in: suggestedCommentsIds } });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};
