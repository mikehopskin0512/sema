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
    const bulkUpdateOrganizations = data.map((item) => {
      return {
        updateOne: {
          filter: { name: item.name },
          update: { $set: { avatarUrl: item.avatarUrl } }
        }
      }
    });
    await mongoose.connection.collection('organizations')
      .bulkWrite(bulkUpdateOrganizations, { ordered: true });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
}

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const bulkUpdateOrganizations = data.map((item) => {
      return {
        updateOne: {
          filter: { name: item.name },
          update: { $unset: { avatarUrl: "" } }
        }
      }
    });
    await mongoose.connection.collection('organizations')
      .bulkWrite(bulkUpdateOrganizations, { ordered: true });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};
