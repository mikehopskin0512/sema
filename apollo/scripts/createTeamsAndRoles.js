import mongoose from 'mongoose';
import User from '../src/users/userModel';
import Team from '../src/teams/teamModel';
import Role from '../src/roles/roleModel';
import UserRole from '../src/roles/userRoleModel';

import { mongooseUri } from '../src/config';

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const createTeams = async () => {
  await Team.create({
    name: 'Sema Super Team',
  });
};

const createRoles = async () => {
  await Role.create([
    {
      name: 'Admin',
      canViewAdmin: true,
      canEditUsers: true,
      canEditComments: true,
      canEditGuides: true,
      canManageLinks: true,
    },
    {
      name: 'Library Admin',
      canViewAdmin: false,
      canEditUsers: false,
      canEditComments: true,
      canEditGuides: false,
      canManageLinks: false,
    },
  ]);
};

const createUserRoles = async () => {
  const user1 = await User.findOne({ username: 'aslanlin21@gmail.com' });
  const user2 = await User.findOne({ username: 'matt@semasoftware.com' });
  const semaTeam = await Team.findOne({ name: 'Sema Super Team' });
  const adminRole = await Role.findOne({ name: 'Admin' });
  const libraryAdminRole = await Role.findOne({ name: 'Library Admin' });
  
  await UserRole.insertMany([
    {
      user: user1._id,
      team: semaTeam._id,
      role: libraryAdminRole
    },
    {
      user: user2._id,
      team: semaTeam._id,
      role: adminRole
    },
  ]);
}

(async () => {
  try {
    await mongoose.connect(mongooseUri, options);
    console.log('Connected to DocumentDB successfully');
  } catch (err) {
    console.log('Error while Connecting to Apollo - Document DB', err);
  }
  console.log('START MIGRATION!!!');
  // await createTeams();
  // await createRoles();
  await createUserRoles();
  console.log('END!!!');
})();
