import Team from './teamModel';
import UserRole from '../roles/userRoles/userRoleModel';

export const getTeams = async (userId) => {
  const teams = await Team.find({ createdBy: userId });
  return teams;
};

export const createTeam = async (data) => {
  const team = new Team(data);
  await team.save();

  return team;
};

export const getTeamMembers = async (teamId, { page, perPage }) => {
  const members = await UserRole.find({ team: teamId })
    .skip(perPage * (page - 1))
    .limit(perPage)
    .populate('user')
    .populate('role');

  const totalCount = await UserRole.countDocuments({ team: teamId });

  return { members, totalCount };
};

export const addTeamMembers = async (team, users, role) => {
  await Promise.all(users.map(async (user) => {
    const isExist = await UserRole.exists({ team, user });
    if (isExist) {
      await UserRole.updateOne({ team, user }, { role });
    } else {
      await UserRole.create({ team, user, role });
    }
  }));
};


