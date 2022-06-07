const DEFAULT_ORGANIZATION_NAME = 'Semalab'

module.exports = {
  async up(db) {
    try {
      const smartComments = await db.collection('smartComments').find({}).toArray();

      await Promise.all(smartComments.map(async (comment) => {
        await db.collection('smartComments').findOneAndUpdate(
          { _id: comment._id },
          [
            {
              $addFields: {
                githubMetadata: {
                  organization: DEFAULT_ORGANIZATION_NAME
                }
              }
            }
          ]
        );
      }));
    } catch (e) {
      console.log(e)
    }
  },

  async down(db, client) {}
};
