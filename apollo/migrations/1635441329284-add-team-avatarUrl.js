const mongoose = require('mongoose');

const { mongooseUri } = require('../src/config');

const { Types: { ObjectId } } = mongoose;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    await mongoose.connection
      .collection('teams')
      .findOneAndUpdate(
        { name: 'Sema Super Team' },
        { $set: { avatarUrl: '/img/logo.png' } },
      );
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
}

exports.down = async (next) => {
};
