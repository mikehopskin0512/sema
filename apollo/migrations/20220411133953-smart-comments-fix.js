const mongoose = require('mongoose');

const { Types: { ObjectId } } = mongoose;

const userId = '624d4c96a6504b01b53c2e7e';

module.exports = {
  async up(db) {
    const portfolios = await db.collection('portfolios')
      .find({})
      .toArray();

    const users = await db.collection('users')
      .find({})
      .toArray();


    const updatedPortfolios = await Promise.all(portfolios.map(async portfolio => {
      const snaps = portfolio.snapshots;
      if (!snaps) return portfolio;

      return {
        ...portfolio,
        snapshots: await Promise.all(snaps.map(async snap => await db.collection('snapshots')
          .findOne({ _id: new ObjectId(snap.id) }))),
      };
    }));

    await Promise.all(updatedPortfolios.map(async portfolio => {
      if (!portfolio.snapshots) return portfolio;

      await Promise.all(portfolio.snapshots.map(async (snap) => {
        if (!snap?.componentData?.smartComments?.length) return snap;

        const updatedComments = snap?.componentData?.smartComments?.length ? snap?.componentData?.smartComments?.map(com => {
          if (users.some(i => i._id.toString() === com.userId.toString())) {
            return com;
          } else {
            return {
              ...com,
              userId: new ObjectId(userId),
            };
          }
        }) : [];

        const updatedComponentData = {
          ...snap?.componentData,
          smartComments: updatedComments,
        };

        await db.collection('snapshots')
          .findOneAndUpdate({ _id: new ObjectId(snap._id) }, { $set: { componentData: updatedComponentData } });
      }));
    }));
  },

  async down(db, client) {
  },
};
