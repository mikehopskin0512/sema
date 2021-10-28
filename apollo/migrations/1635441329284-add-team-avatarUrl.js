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
        { _id: ObjectId('614f2fe7811ae802fc08e36e') },
        { $set: { avatarUrl: '/img/logo.png' } },
      );
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
}

exports.down = async (next) => {
};
