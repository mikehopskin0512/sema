const mongoose = require('mongoose');
const fs = require('fs');

const { mongooseUri } = require('../src/config');
const data = require('../data/roles');

const { Types: { ObjectId } } = mongoose;

const roleIds = data.map(({ _id }) => new ObjectId(_id));

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const roles = await mongoose.connection
      .collection('roles')
      .insertMany(data.map((roleItem) => ({
        ...roleItem,
        _id: new ObjectId(roleItem._id)
      })));
    fs.writeFileSync(`${process.cwd()}/data/roles.json`, JSON.stringify(roles.ops));
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const Role = mongoose.connection.db.collection('roles');
    await Role.deleteMany({ _id: { $in: roleIds } });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};
