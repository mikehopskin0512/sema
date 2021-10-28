const mongoose = require('mongoose');

const { mongooseUri } = require('../src/config');
const data = require('../data/imgUrls');

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};


exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    await Promise.all(data.map(async (item) => {
      const { avatarUrl, name } = data.find((team) => team.name === item.name)
      await mongoose.connection
        .collection('teams')
        .findOneAndUpdate(
          { name },
          { $set: { avatarUrl } },
        );
    }))
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
}

exports.down = async (next) => {
};
