const mongoose = require('mongoose');

const { Types: { ObjectId } } = mongoose;

module.exports = {
  async up(db) {
    try {
      // -- Sema Community Collections
      const [semaTeam] = await db.collection('organizations').find({ name: 'Sema Corporate Team' }).toArray();
      const communityCollectionsIds = semaTeam.collections.map(({ collectionData }) => (new ObjectId(collectionData)));

      await db.collection('collections').updateMany({ _id: { $in: communityCollectionsIds } }, { $set: { type: 'community' } });

      // -- Personal Collections
      const mySnippetCollections = await db.collection('collections').find({ name: 'My Snippets' }).toArray();
      const personalSnippetsIds = mySnippetCollections.map(({ _id }) => (new ObjectId(_id)));

      await db.collection('collections').updateMany({ _id: { $in: personalSnippetsIds } },
        { $set: { type: 'personal' } },
        { upsert: true });

      // -- Teams Collections
      const teams = await db.collection('teams').find({}).toArray();
      const teamsName = teams.map(({ name }) => (name));

      const teamsCollections = await db.collection('collections').find({ author: { $in: teamsName } }).toArray();
      const teamsCollectionsIds = teamsCollections.map(({ _id }) => (new ObjectId(_id)));
      await db.collection('collections').updateMany({ _id: { $in: teamsCollectionsIds } }, { $set: { type: 'team' } }, { upsert: true });
    } catch (error) {
      console.log('error__', error);
    }
  },

  async down(db) {
    await db.collection('collections').updateMany({}, { $unset: 'type' });
  },
};
