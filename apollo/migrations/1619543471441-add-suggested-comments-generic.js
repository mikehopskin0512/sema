const mongoose = require('mongoose');
const fs = require('fs');
const data = require('../data/commentBankGeneric');

const { mongooseUri } = require('../src/config');

const { Types: { ObjectId } } = mongoose;

const suggestedCommentsIds = data.map(({ _id }) => new ObjectId(_id));

const commentSourceData = [];
data.forEach((item) => {
  const existingSource = commentSourceData.findIndex((source) => source.name === item.sourceName);
  if (existingSource < 0) {
    const commentSource = {
      _id: new ObjectId(),
      name: item.sourceName,
      url: item.sourceUrl,
    };
    commentSourceData.push(commentSource);
  }
});

const suggestedCommentsData = data.map(({
  _id, comment, sourceName, sourceUrl, title,
}) => {
  let commentSource = commentSourceData.find((sourceItem) => sourceItem.name === sourceName);
  if (!commentSource) {
    commentSource = {
      _id: new ObjectId(),
      name: sourceName,
      url: sourceUrl,
    };
    commentSourceData.push(commentSource);
  }

  const suggestedComment = { title, comment, source: commentSource._id };
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
    // migrate comment sources
    const colSources = mongoose.connection.db.collection('commentSources');
    const commentSources = await colSources.insertMany(commentSourceData);

    // migrate suggested comments
    const colComments = mongoose.connection.db.collection('suggestedComments');
    const suggestedComments = await colComments.insertMany(suggestedCommentsData);

    // produce output data
    const outputData = suggestedComments.ops.map((suggestedComment) => {
      const commentSource = commentSources.ops.find((item) => item._id === suggestedComment.source);
      return {
        _id: suggestedComment._id,
        title: suggestedComment.title,
        comment: suggestedComment.comment,
        sourceName: commentSource.name,
        sourceUrl: commentSource.url,
      };
    });
    fs.writeFileSync(`${process.cwd()}/data/commentBankGeneric.json`, JSON.stringify(outputData));
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const colComments = mongoose.connection.db.collection('suggestedComments');
    const commentsData = colComments.find({ _id: { $in: suggestedCommentsIds } });
    await colComments.deleteMany({ _id: { $in: suggestedCommentsIds } });

    const commentSourceIds = commentsData.map((comment) => comment.source);
    const colSources = mongoose.connection.db.collection('commentSources');
    await colSources.deleteMany({ _id: { $in: commentSourceIds } });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};
