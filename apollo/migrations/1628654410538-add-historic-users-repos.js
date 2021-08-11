const mongoose = require('mongoose');
const fs = require('fs');
const data = require('../data/userRepos') || [];

const { mongooseUri } = require('../src/config');

const { Types: { ObjectId } } = mongoose;

const userReposIds = data.map(({ _id }) => new ObjectId(_id));

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const smartComments = await mongoose.connection.collection('smartComments').find({}).toArray();
    const repos = [...new Set(smartComments.map(({ githubMetadata }) => (githubMetadata.repo_id)))];

    const finalRepos = await Promise.all(repos.map(async (repo) => {
      if (typeof repo !== 'undefined') {
        const repoSmartComments = await mongoose.connection.collection('smartComments').find({ 'githubMetadata.repo_id': repo }).toArray();
        const newRepo = {
          externalId: repo,
          description: '',
          type: 'github',
          language: '',
          cloneUrl: '',
          repoStats: { reactions: [], tags: [], userIds: [] },
          repositoryCreatedAt: null,
          repositoryUpdatedAt: null,
        };

        repoSmartComments.forEach(({ _id, userId, reaction, tags, githubMetadata, createdAt }) => {
          newRepo.name = githubMetadata.repo;
          newRepo.repoStats.reactions.push({
            reactionId: reaction,
            smartCommentId: _id,
            createdAt,
          });
          newRepo.repoStats.tags.push({
            tagsId: tags,
            smartCommentId: _id,
            createdAt,
          });
          newRepo.repoStats.userIds.push(userId);
        });

        return newRepo;
      }
    }));

    const colrepositories = mongoose.connection.db.collection('repositories');
    const dbRepos = await colrepositories.insertMany(finalRepos);
    fs.writeFileSync(`${process.cwd()}/data/userRepos.json`, JSON.stringify(dbRepos.ops));
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const colrepositories = mongoose.connection.db.collection('repositories');
    await colrepositories.deleteMany({ _id: { $in: userReposIds } });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};
