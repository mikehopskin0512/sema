const mongoose = require('mongoose');
const fs = require('fs');
const data = require('../data/commentSources');

const { mongooseUri } = require('../src/config');

const { Types: { ObjectId } } = mongoose;

const commentSourcesId = data.map(({ _id }) => new ObjectId(_id));

const commentSourcesData = data.map(({
  _id, name, url, isActive,
}) => {
  const commentSource = { name, url, isActive };
  if (_id) {
    commentSource._id = new ObjectId(_id);
  }
  return commentSource;
});

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const colCommentSources = mongoose.connection.db.collection('commentSources');
    const commentSources = await colCommentSources.insertMany(commentSourcesData);
    fs.writeFileSync(`${process.cwd()}/data/commentSources.json`, JSON.stringify(commentSources.ops));
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const colCommentSources = mongoose.connection.db.collection('commentSources');
    await colCommentSources.deleteMany({ _id: { $in: commentSourcesId } });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};
