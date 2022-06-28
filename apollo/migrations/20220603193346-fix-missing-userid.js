const mongoose = require('mongoose');

module.exports = {
  async up(db) {
    const smartComments = await db
      .collection('smartComments')
      .find({ userId: null })
      .toArray();
    await Promise.all(
      smartComments.map(async (smartComment) => {
        const {
          githubMetadata: { user },
        } = smartComment;
        const githubUser = await db.collection('users').findOne({
          $or: [
            {
              'identities.provider': 'github',
              'identities.username': user.login,
            },
            {
              'identities.provider': 'github',
              'identities.profileUrl': `https://api.github.com/users/${user.login}`,
            },
          ],
        });
        if (githubUser && githubUser._id) {
          await db
            .collection('smartComments')
            .findOneAndUpdate({ _id: smartComment._id }, [
              {
                $addFields: {
                  userId: githubUser._id,
                },
              },
            ]);
        }
      })
    );
  },
};
