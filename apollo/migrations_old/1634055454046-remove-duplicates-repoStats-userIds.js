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
    const repos = await mongoose.connection
      .collection('repositories')
      .aggregate([
        {
          $addFields: {
            'repoStats.userIds': { $setUnion: ['$repoStats.userIds', []] },
          },
        },
      ]).toArray();

    await Promise.all(repos.map(async (repo) => {
      try {
        await mongoose.connection
        .collection('repositories')
        .findOneAndUpdate(
          { _id: new ObjectId(repo._id) },
          { $set: { 'repoStats.userIds': repo.repoStats.userIds } },
          { upsert: true },
        );
      } catch (error) { 
        next(error);
      }
    }));

  } catch (error) {
    next(error);
  }
};

exports.down = async (next) => {
};
