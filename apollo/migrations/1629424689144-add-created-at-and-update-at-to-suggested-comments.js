const mongoose = require('mongoose');

const { mongooseUri } = require('../src/config');

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    await mongoose.connection
      .collection('suggestedComments')
      .updateMany(
        { $or: [{ createdAt: null }, { updatedAt: null }] },
        { $set: { createdAt: '2021-03-14T00:00:01.000Z', updatedAt: '2021-03-14T00:00:01.000Z' } },
      );
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
};
