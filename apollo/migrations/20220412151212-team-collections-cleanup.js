const mongoose = require('mongoose');

const { Types: { ObjectId } } = mongoose;

module.exports = {
  async up(db) {
    const eddieCollection = await db.collection('collections').findOne({ type: 'organization', name: 'EddieHub\'s Snippets' });
    const eddieCollectionId = eddieCollection ? eddieCollection._id : null;
    const eddieOrganization = await db.collection('organizations').findOne({ name: 'EddieHub' });
    const eddieOrganizationId = eddieOrganization ? eddieOrganization._id : null;

    await db.collection('collections').deleteMany({ $and: [{ type: 'organization' }, { _id: { $ne: eddieCollectionId } }] });
    const organizations = await db.collection('organizations').find({}).toArray();

    await Promise.all(organizations.map(async (organization) => {
      let collectionId = null;
      if (organization._id.equals(eddieOrganizationId)) {
        await db.collection('collections').updateOne({ _id: eddieCollectionId }, { $set: { organizationId: eddieOrganizationId } });
        collectionId = eddieCollectionId;
      } else {
        const newCollection = await db.collection('collections').insertOne({
          name: `${organization.name}'s Snippets`,
          comments: [],
          isActive: true,
          description: '',
          author: organization.name,
          type: 'organization',
          tags: [],
          organizationId: new ObjectId(organization._id),
          createdAt: organization.createdAt || new Date(),
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
      await db.collection('organizations').updateOne({ _id: team._id}, {$set: { collections } });
    }));
  },

  async down() {
    //
  },
};
