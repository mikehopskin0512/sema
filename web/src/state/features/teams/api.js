import { create, getAll } from '../../utils/api';

export const fetchTeams = (token) => getAll('/api/proxy/teams', {}, token);
export const addTeam = (body, token) => create('/api/proxy/teams', body, token);
