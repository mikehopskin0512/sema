import Team from './teamModel';

export const getTeams = async (userId) => {
  const teams = await Team.find({ createdBy: userId });
  return teams;
};

export const createTeam = async (data) => {
  const team = new Team(data);
  await team.save();

  return team;
};
