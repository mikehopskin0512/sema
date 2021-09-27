const mongoose = require('mongoose');
const fs = require('fs');

const { mongooseUri } = require('../src/config');
const data = require('../data/userRoles');

const { Types: { ObjectId } } = mongoose;

const userRoleIds = data.map(({ _id }) => new ObjectId(_id));

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

exports.up = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const User = mongoose.connection.collection('users');
    const Team = mongoose.connection.collection('teams');
    const Role = mongoose.connection.collection('roles');
    const UserRole = mongoose.connection.collection('userroles');

    const user1 = await User.findOne({ username: 'aslanlin21@gmail.com' });
    const user2 = await User.findOne({ username: 'mvi@semasoftware.com' });
    const semaTeam = await Team.findOne({ name: 'Sema Super Team' });
    const adminRole = await Role.findOne({ name: 'Admin' });
    const libraryAdminRole = await Role.findOne({ name: 'Library Admin' });

    const isExist1 = await UserRole.findOne({ user: user1._id, team: semaTeam._id, role: libraryAdminRole._id });
    const isExist2 = await UserRole.findOne({ user: user2._id, team: semaTeam._id, role: adminRole._id });
    const dataSource = [];
    if (!isExist1) {
      dataSource.push({
        user: user1._id,
        team: semaTeam._id,
        role: libraryAdminRole._id,
      });
    }
    if (!isExist2) {
      dataSource.push({
        user: user2._id,
        team: semaTeam._id,
        role: adminRole._id,
      });
    }

    const userRoles = await UserRole.insertMany(dataSource);

    fs.writeFileSync(`${process.cwd()}/data/userRoles.json`, JSON.stringify(userRoles.ops));
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};

exports.down = async (next) => {
  await mongoose.connect(mongooseUri, options);
  try {
    const UserRole = mongoose.connection.db.collection('userroles');
    await UserRole.deleteMany({ _id: { $in: userRoleIds } });
  } catch (error) {
    next(error);
  }
  mongoose.connection.close();
};
