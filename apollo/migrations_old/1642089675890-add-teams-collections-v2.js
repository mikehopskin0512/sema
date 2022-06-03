const mongoose = require('mongoose');
const fs = require('fs');
const organizationsCollections = require('../data/organizationsCollections.json');

const { mongooseUri } = require('../src/config');

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const { Types: { ObjectId } } = mongoose;
module.exports.up = async (next) => {
  try {
    await mongoose.connect(mongooseUri, options);

    const organizations = await mongoose.connection.collection('organizations').find({ collections: { $exists: false } }).toArray();
    const collections = [];
    await Promise.all(organizations.map(async (organization) => {
      const collection = await mongoose.connection.collection('collections').insertOne({
        name: `${organization.name}'s Snippets`,
        description: organization.description,
        tags: [],
        comments: [],
        author: organization.name,
        source: {
          name: '',
          url: '',
        },
        isActive: true
      });
      collections.push(collection.insertedId);
      await mongoose.connection.collection('organizations')
        .findOneAndUpdate({ _id: new ObjectId(organization._id) }, { $set: { collections: [{ isActive: true, collectionData: collection.insertedId}] } });
    }));
    fs.writeFileSync(`${process.cwd()}/data/organizationsCollections.json`, JSON.stringify(collections));

    await mongoose.connection.close();
  } catch (e) {
    next(e);
  }
};

module.exports.down = async (next) => {
  try {
    await mongoose.connect(mongooseUri, options);

    await mongoose.connection
      .collection('organizations')
      .updateMany(
        { collections: { $exists: true } },
        { $unset: { collections: [] } },
      );

    const collectionIds = organizationsCollections.map((id) => new ObjectId(id));
    await mongoose.connection.collection('collections')
      .deleteMany({ _id: { $in: collectionIds } });

    await mongoose.connection.close();
  } catch (e) {
    next(e);
  }
};
