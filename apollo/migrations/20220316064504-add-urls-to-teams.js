module.exports = {
  async up(db) {
    const teams = await db.collection('teams').find({ url: null }).toArray();
    await Promise.all(teams.map(async (team) => {
      const url = team._id.toString();
      await db.collection('teams').findOneAndUpdate(
        { _id: team._id },
        { $set: { url } },
      );
    }));
  },

  async down() {
    //
  },
};
