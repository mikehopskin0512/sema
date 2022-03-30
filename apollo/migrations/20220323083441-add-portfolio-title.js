module.exports = {
  async up(db) {
    const portfolios = await db.collection('portfolios').find().toArray();
    await Promise.all(portfolios.map(async (portfolio, index) => {
      const title = portfolio.title || `Portfolio ${index + 1}`;
      await db.collection('portfolios').findOneAndUpdate(
        { _id: portfolio._id },
        { $set: { title } },
      );
    }));
  },

  async down() {
    //
  },
};
