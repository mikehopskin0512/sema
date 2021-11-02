const mongoose = require('mongoose');

const { mongooseUri } = require('../src/config');

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

module.exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    await mongoose.connection.collection('collections')
      .updateMany({
        name: "My Comments"
      }, {
        $set: { name: "My Snippets" }
      });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
}

module.exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    await mongoose.connection.collection('collections')
      .updateMany({
        name: "My Snippets"
      }, {
        $set: { name: "My Comments" }
      });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
}
