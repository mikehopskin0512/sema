const mongoose = require('mongoose');
const fs = require('fs');

const { mongooseUri } = require('../src/config');
const data = require('../data/userRoles2');

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
    const Organization = mongoose.connection.collection('organizations');
    const Role = mongoose.connection.collection('roles');
    const UserRole = mongoose.connection.collection('userroles');

    const dataSource = [];
    await Promise.all(data.map(async (userRole) => {
      const user = await User.findOne({ username: userRole.user });
      const organization = await Organization.findOne({ name: userRole.organization });
      const role = await Role.findOne({ name: userRole.role });

      if (!user || !organization || !role) return false;

      const isExist = await UserRole.findOne({ user: user._id, team: team._id, role: role._id });

      if (!isExist) {
        dataSource.push({
          user: user._id,
          team: team._id,
          role: role._id,
        });
      }
    }));

    if (!dataSource.length) return;

    const userRoles = await UserRole.insertMany(dataSource);

    const mappedData = await Promise.all(userRoles.ops.map(async (userRole) => {
      const user = await User.findOne({ _id: userRole.user });
      const team = await Team.findOne({ _id: userRole.team });
      const role = await Role.findOne({ _id: userRole.role });

      return {
        _id: userRole._id,
        user: user.username,
        team: team.name,
        role: role.name,
      };
    }));

    fs.writeFileSync(`${process.cwd()}/data/userRoles2.json`, JSON.stringify(mappedData));
  } catch (error) {
    console.log(error);
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
