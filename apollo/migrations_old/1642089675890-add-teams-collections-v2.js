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

    const organizations = await mongoose.connection.collection('teams').find({ collections: { $exists: false } }).toArray();
    const collections = [];
    await Promise.all(teams.map(async (team) => {
      const collection = await mongoose.connection.collection('collections').insertOne({
        name: `${team.name}'s Snippets`,
        description: team.description,
        tags: [],
        comments: [],
        author: team.name,
        source: {
          name: '',
          url: '',
        },
        isActive: true
      });
      collections.push(collection.insertedId);
      await mongoose.connection.collection('teams')
        .findOneAndUpdate({ _id: new ObjectId(team._id) }, { $set: { collections: [{ isActive: true, collectionData: collection.insertedId}] } });
    }));
    fs.writeFileSync(`${process.cwd()}/data/teamsCollections.json`, JSON.stringify(collections));

    await mongoose.connection.close();
  } catch (e) {
    next(e);
  }
};

module.exports.down = async (next) => {
  try {
    await mongoose.connect(mongooseUri, options);

    await mongoose.connection
      .collection('teams')
      .updateMany(
        { collections: { $exists: true } },
        { $unset: { collections: [] } },
      );

    const collectionIds = teamsCollections.map((id) => new ObjectId(id));
    await mongoose.connection.collection('collections')
      .deleteMany({ _id: { $in: collectionIds } });

    await mongoose.connection.close();
  } catch (e) {
    next(e);
  }
};
