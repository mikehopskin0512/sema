const mongoose = require('mongoose');

const { Types: { ObjectId } } = mongoose;

module.exports = {
  async up(db) {
    const eddieCollection = await db.collection('collections').findOne({ type: 'organization', name: 'EddieHub\'s Snippets' });
    const eddieCollectionId = eddieCollection ? eddieCollection._id : null;
    const eddieTeam = await db.collection('organizations').findOne({ name: 'EddieHub' });
    const eddieTeamId = eddieTeam ? eddieTeam._id : null;

    await db.collection('collections').deleteMany({ $and: [{ type: 'team' }, { _id: { $ne: eddieCollectionId } }] });
    const teams = await db.collection('teams').find({}).toArray();

    await Promise.all(teams.map(async (team) => {
      let collectionId = null;
      if (team._id.equals(eddieTeamId)) {
        await db.collection('collections').updateOne({ _id: eddieCollectionId }, { $set: { teamId: eddieTeamId } });
        collectionId = eddieCollectionId;
      } else {
        const newCollection = await db.collection('collections').insertOne({
          name: `${team.name}'s Snippets`,
          comments: [],
          isActive: true,
          description: '',
          author: team.name,
          type: 'team',
          tags: [],
          teamId: new ObjectId(team._id),
          createdAt: team.createdAt || new Date(),
          updatedAt: new Date(),
          __v: 0,
        });
        collectionId = newCollection.insertedId;
      }

      const collections = [{
        collectionData: new ObjectId(collectionId),
        isActive: true,
        _id: new ObjectId(),
      }]
      await db.collection('teams').updateOne({ _id: team._id}, {$set: { collections } });
    }));
  },

  async down() {
    //
  },
};
