const mongoose = require('mongoose');

const { mongooseUri } = require('../src/config');
const oldRoles = require('../data/roles.json');
const oldTeams = require('../data/teams.json');
const newRolesData = require('../data/rolesV2.json');
const newTeamsData = require('../data/teamsV2.json');

const { Types: { ObjectId } } = mongoose;

const makeMongooseData = (data) => data.map(({_id, ...restData}) => {
  const result = {...restData};
  if (_id) {
    result._id = new ObjectId(_id);
  }
  return result;
});

const oldTeamsData = makeMongooseData(oldTeams);
const oldRolesData = makeMongooseData(oldRoles);
const teamsData = makeMongooseData(newTeamsData);
const rolesData = makeMongooseData(newRolesData);

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const Team = mongoose.connection.collection('teams');
    const Role = mongoose.connection.collection('roles');
    
    // remove all roles
    await Role.deleteMany({_id: {$in: rolesData.map(item => item._id)}});
    await Role.insertMany(rolesData);
    
    // update existing teams
    for (const teamItem of teamsData) {
      const {_id, ...restTeamData} = teamItem;
      await Team.updateOne({_id: teamItem._id}, {$set: {...restTeamData}}, {upsert: true});
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const Team = mongoose.connection.collection('teams');
    const Role = mongoose.connection.collection('roles');
    
    // remove all roles
    await Role.deleteMany({_id: {$in: rolesData.map(item => item._id)}});
    await Role.insertMany(oldRolesData);
    
    // remove all teams
    await Team.deleteMany({_id: {$in: teamsData.map(item => item._id)}})
    await Team.insertMany(oldTeamsData);
  } catch (error) {
    console.log(error);
    next(error);
  }
  mongoose.connection.close();
};
