const mongoose = require('mongoose');

const { Types: { ObjectId } } = mongoose;

module.exports = {
  async up(db) {
    const smartComments = await db.collection('smartComments').find({}).toArray();
    const repositories = await db.collection('repositories').find({}).toArray();
    const users = await db.collection('users').find({}).toArray();

    clearedStatsRepos = repositories.map(repository => {
      repository.repoStats.smartCodeReviews = 0;
      repository.repoStats.smartComments = 0;
      repository.repoStats.smartCommenters = 0;
      repository.repoStats.semaUsers = 0;
      repository.repoStats.userIds = [];
      return repository;
    });

    const pullNumbers = {};
    smartComments.forEach(comment => {
      const repo = clearedStatsRepos.find(repo => repo.name === comment.githubMetadata.repo);
      if (!repo) return;
      const repoIndex = clearedStatsRepos.findIndex(repo => repo.name === comment.githubMetadata.repo);
      
      if (!pullNumbers[repo.name]?.includes(comment.githubMetadata.pull_number)) {
        repo.repoStats.smartCodeReviews += 1;
        if(!pullNumbers[repo.name]) {
          pullNumbers[repo.name] = [];
        }
        pullNumbers[repo.name].push(comment.githubMetadata.pull_number);
      }

      const repoUserIds = repo.repoStats.userIds.map((id) => id.toString());
      if (comment.userId && !repoUserIds.includes(comment.userId.toString())) {
        repo.repoStats.userIds.push(comment.userId);
        repo.repoStats.smartCommenters += 1;
        repo.repoStats.semaUsers += 1;
      }

      if (comment.githubMetadata.requester) {
        const user = users.find(u => u.identities[0]?.username === comment.githubMetadata.requester);
        if (user && user._id && !repoUserIds.includes(user._id.toString())) {
          repo.repoStats.userIds.push(user._id);
          repo.repoStats.smartCommenters += 1;
          repo.repoStats.semaUsers += 1;
        }
      }

      repo.repoStats.smartComments += 1;
      clearedStatsRepos.splice(repoIndex, 1, repo);
    });

    await Promise.all(clearedStatsRepos.map(async ({ _id, repoStats }) => {
      await db.collection('repositories').findOneAndUpdate(
        { _id: new ObjectId(_id) }, { $set: { repoStats } }, { upsert: true },
      );
    }));
  },

  async down(db, client) {
  }
};
