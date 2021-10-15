import { create, getAll } from '../../utils/api';

export const getAllTeams = (token) => getAll('/api/proxy/teams', {}, token);
export const addTeam = (body, token) => create('/api/proxy/teams', body, token);
