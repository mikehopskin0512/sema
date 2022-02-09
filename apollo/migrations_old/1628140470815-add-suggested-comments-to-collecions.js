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
      .collection('collections')
      .findOneAndUpdate(
        { name: 'Philosophies' },
        { $push: { comments: { $each: [new ObjectId('60f6594718ceb37418ce3b74'), new ObjectId('60f6594718ceb37418ce3b75')] } } },
      );
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    await mongoose.connection
      .collection('collections')
      .findOneAndUpdate(
        { _name: 'Philosophies' },
        { $pull: { comments: { $in: [new ObjectId('60f6594718ceb37418ce3b74'), new ObjectId('60f6594718ceb37418ce3b75')]} } },
      );
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};
