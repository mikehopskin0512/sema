const mongoose = require('mongoose');
const fs = require('fs');
const data = require('../data/commentBankGeneric');

const { mongooseUri } = require('../src/config');

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

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const colComments = mongoose.connection.db.collection('suggestedcomments');
    const suggestedComments = await colComments.insertMany(suggestedCommentsData);
    fs.writeFileSync(`${process.cwd()}/data/commentBankGeneric.json`, JSON.stringify(suggestedComments.ops));
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const colComments = mongoose.connection.db.collection('suggestedcomments');
    await colComments.deleteMany({ _id: { $in: suggestedCommentsIds } });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};