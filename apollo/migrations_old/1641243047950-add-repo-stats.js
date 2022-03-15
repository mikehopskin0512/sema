const fs = require('fs');
const mongoose = require('mongoose');

const data = require('../data/repos');
const { mongooseUri } = require('../src/config');

const { Types: { ObjectId } } = mongoose;

const reposIds = data.map((id) => (new ObjectId(id)));

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

exports.up = async (next) => {
await mongoose.connect(mongooseUri, options);
  try {
    const repositories = await mongoose.connection.collection('repositories').find({}).toArray();

    const updatedRepos = await Promise.all(
      repositories.map(async ({ _id, externalId, repoStats }) => {
        // eslint-disable-next-line max-len
        const repoUsers = [...new Set(repoStats.userIds.map((user) => (user ? user.toString() : null)))].map(((id) => (new ObjectId(id)))) || [];
        const semaUsers = await mongoose.connection.collection('users').find({ _id: { $in: repoUsers } }).count();
        // eslint-disable-next-line max-len
        const repoSmartComments = await mongoose.connection.collection('smartComments').find({ 'githubMetadata.repo_id': externalId }).toArray();
        const smartCodeReviews = [...new Set(repoSmartComments.map(({ githubMetadata: { pull_number } }) => (pull_number)))].length || 0;
        const smartComments = repoSmartComments.length || 0;
        const smartCommenters = semaUsers;

        await mongoose.connection
          .collection('repositories')
          .findOneAndUpdate({ _id: new ObjectId(_id) }, {
            $set: {
              'repoStats.smartCodeReviews': smartCodeReviews,
              'repoStats.smartComments': smartComments,
              'repoStats.smartCommenters': smartCommenters,
              'repoStats.semaUsers': semaUsers,
            },
          }, { upsert: true });
        return _id;
      }),
    );
    fs.writeFileSync(`${process.cwd()}/data/repos.json`, JSON.stringify(updatedRepos));
  } catch (error) {
    next(error);
  }
  await mongoose.connection.close();
};

exports.down = async (next) => {
  try {
    reposIds.map(async (id) => {
      await mongoose.connection
        .collection('repositories')
        .findOneAndUpdate(
          { _id: id },
          {
            $set: {
              'repoStats.smartCodeReviews': 0,
              'repoStats.smartComments': 0,
              'repoStats.smartCommenters': 0,
              'repoStats.semaUsers': 0,
            },
          },
          { upsert: true },
        );
    });
  } catch (error) {
    next(error);
  }
  await mongoose.connection.close();
};
