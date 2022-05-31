module.exports = {
  async up(db) {
    const organizations = await db.collection('organizations').find({ url: null }).toArray();
    await Promise.all(organizations.map(async (organization) => {
      const url = organization._id.toString();
      await db.collection('organizations').findOneAndUpdate(
        { _id: organization._id },
        { $set: { url } },
      );
    }));
  },

  async down() {
    //
  },
};
