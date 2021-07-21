const mongoose = require('mongoose');
const fs = require('fs');
const data = require('../data/suggestedComments');

const { mongooseUri } = require('../src/config');

const { Types: { ObjectId } } = mongoose;

const suggestedCommentsIds = data.map(({ _id }) => new ObjectId(_id));

const suggestedCommentsData = data.map(({
  _id, displayId, title, comment, author, source, engGuides, tags, isActive,
}) => {
  const suggestedComment = { displayId, title, comment, author, source, engGuides, tags, isActive };
  if (_id) {
    suggestedComment._id = new ObjectId(_id);
  }

  suggestedComment.tags = tags.map(({ tag, type, label }) => ({ tag: new ObjectId(tag), type, label }));
  suggestedComment.engGuides = engGuides.map((engGuide) => new ObjectId(engGuide));
  return suggestedComment;
});

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const colSuggestedComments = mongoose.connection.db.collection('suggestedComments');
    const suggestedComments = await colSuggestedComments.insertMany(suggestedCommentsData);
    fs.writeFileSync(`${process.cwd()}/data/suggestedComments.json`, JSON.stringify(suggestedComments.ops));
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const colSuggestedComments = mongoose.connection.db.collection('suggestedComments');
    await colSuggestedComments.deleteMany({ _id: { $in: suggestedCommentsIds } });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};
