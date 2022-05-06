module.exports = {
  async up(db) {
    const snapshots = await db.collection('snapshots').find({}).toArray();
    await Promise.all(snapshots.map(async (snapshot) => {
      await db.collection('snapshots').findOneAndUpdate(
        { _id: snapshot._id },
        { $set: { isHorizontal: snapshot.componentType === 'comments' } },
      );
    }));
  },

  async down() {
    //
  },
};
