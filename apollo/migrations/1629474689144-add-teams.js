const mongoose = require('mongoose');
const fs = require('fs');

const { mongooseUri } = require('../src/config');
const data = require('../data/teams');

const { Types: { ObjectId } } = mongoose;

const teamIds = data.map(({ _id }) => new ObjectId(_id));

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const teams = await mongoose.connection
      .collection('teams')
      .insertMany(data);
    fs.writeFileSync(`${process.cwd()}/data/teams.json`, JSON.stringify(teams.ops));
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const Team = mongoose.connection.db.collection('teams');
    await Team.deleteMany({ _id: { $in: teamIds } });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};
