import Team from './teamModel';

export const getTeams = async () => {
  const teams = await Team.find();
  return teams;
};

export const createTeam = async (data) => {
  const team = new Team(data);
  await team.save();

  return team;
};
