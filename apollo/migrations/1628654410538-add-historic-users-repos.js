const mongoose = require('mongoose');
const { mongooseUri } = require('../src/config');

const { Types: { ObjectId } } = mongoose;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const updateUserRepos = async (userIds = [], smartComment, repo) => {
  userIds.forEach(async (userId) => {
    const [githubUrl] = smartComment.githubMetadata.url.split('/pull');
    const [, fullName] = githubUrl.split('https://github.com/');
    await mongoose.connection
      .collection('users')
      .findOneAndUpdate(
        { _id: userId },
        {
          $addToSet: {
            'identities.0.repositories': {
              isFavorite: false,
              id: repo,
              fullName,
              githubUrl,
            },
          },
        },
      );
  });
};

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    let dbRepos = await mongoose.connection.collection('repositories').find({}).toArray();
    dbRepos = dbRepos.map(({ externalId }) => (externalId));
    const smartComments = await mongoose.connection.collection('smartComments').find({}).toArray();
    const repos = [...new Set(smartComments.map(({ githubMetadata }) => (githubMetadata.repo_id)))];

    await Promise.all(repos.map(async (repo) => {
      if (typeof repo !== 'undefined') {
        // Repository already exists`
        if (dbRepos.includes(repo)) {
          const existentRepo = await mongoose.connection.collection('repositories').find({ externalId: repo }).toArray();
          const [existentRepoSmartCommentsIds] = existentRepo.map(({ repoStats: { reactions } }) => (reactions.map(({ smartCommentId }) => (smartCommentId))));

          const missingRepoSmartComments = await mongoose.connection.collection('smartComments').find({ 'githubMetadata.repo_id': repo, _id: { $nin: existentRepoSmartCommentsIds } }).toArray();

          const repoStatsReactions = missingRepoSmartComments.map(({ _id, reaction, createdAt }) => ({ reactionId: reaction, smartCommentId: _id, createdAt }));
          const repoStatsTags = missingRepoSmartComments.map(({ _id, tags, createdAt }) => ({ tagsId: tags, smartCommentId: _id, createdAt }));
          const repoStatsUserIds = [...new Set(missingRepoSmartComments.map(({ userId }) => (userId)))];

          await updateUserRepos(repoStatsUserIds, missingRepoSmartComments[0], repo);

          await mongoose.connection
            .collection('repositories')
            .findOneAndUpdate(
              { externalId: repo },
              {
                $push: {
                  'repoStats.reactions': { $each: repoStatsReactions },
                  'repoStats.tags': { $each: repoStatsTags },
                },
                $addToSet: {
                  'repoStats.userIds': { $each: repoStatsUserIds },
                },
              },
            );
        } else {
          // Repository doesn't exist
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
              smartCommentId: new ObjectId(_id),
              createdAt,
            });
            newRepo.repoStats.userIds.push(userId.toString());
          });

          const userIds = [...new Set(newRepo.repoStats.userIds)].map((id) => new ObjectId(id));
          newRepo.repoStats.userIds = userIds;

          await updateUserRepos(userIds, repoSmartComments[0], repo);

          await mongoose.connection.collection('repositories').insertOne(newRepo);
        }
      }
    }));
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async () => {
};
