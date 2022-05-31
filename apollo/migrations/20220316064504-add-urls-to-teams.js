module.exports = {
  async up(db) {
    const organizations = await db.collection('organizations').find({ url: null }).toArray();
    await Promise.all(organizations.map(async (organization) => {
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
