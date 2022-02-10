const mongoose = require('mongoose');
const teamCollections = require('../data/teamCollections');
const { mongooseUri } = require('../src/config');
const fs = require("fs");

const { Types: { ObjectId } } = mongoose;

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const defaultCollectionNames = ['Famous Quotes', 'Philosophies'];
const teamCollectionRegexp = /\'s Snippets/g;

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const teams = await mongoose.connection.collection('teams').find({}).toArray();
    const allCollections = await mongoose.connection.collection('collections').find({ name: { $ne: "My Snippets", $not: { $regex: teamCollectionRegexp } } }).toArray();
    
    let updatedData = [];
    await Promise.all(teams.map(async (team) => {
      const addedCollections = [];
      const existingTeamCollectionIds = team && team.collections ? team.collections.map(item => item && item.collectionData) : [];
      for (let collection of allCollections) {
        if (existingTeamCollectionIds.includes(collection._id)) continue;
        await mongoose.connection.collection('teams').updateOne(
          { _id: team._id },
          { $push: { collections: { collectionData: collection._id, isActive: defaultCollectionNames.includes(collection.name) } } }
        );
        addedCollections.push({ collectionData: collection._id, isActive: defaultCollectionNames.includes(collection.name) });
      }
      updatedData.push({
        team: team._id,
        collections: addedCollections
      });
    }));
  
    // write the modification information into file
    fs.writeFileSync(`${process.cwd()}/data/teamCollections.json`, JSON.stringify(updatedData));
  } catch (error) {
    console.log(error);
    next(error);
  }
  await mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const teamIds = teamCollections.map(({ team }) => (new ObjectId(team)));
    const teams = await mongoose.connection.collection('teams').find({ _id: { $in: teamIds } }).toArray();
    await Promise.all(teams.map(async (team) => {
      const dataIndex = teamCollections.findIndex(item => item.team == team._id);
      if (dataIndex < 0) return false;
      for (const collectionData of teamCollections[dataIndex].collections) {
        await mongoose.connection.collection('teams').updateOne(
          { _id: team._id },
          { $pull: { collections: { collectionData: new ObjectId(collectionData.collectionData), isActive: collectionData.isActive } } }
        );
      }
    }));
  } catch (error) {
    console.log(error);
    next(error);
  }
  mongoose.connection.close();
};
