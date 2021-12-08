import { create, getAll } from '../../utils/api';

export const getTeams = (token) => getAll('/api/proxy/teams', {}, token);
export const addTeam = (body, token) => create('/api/proxy/teams', body, token);
export const getTeamMembers = (id, params, token) => getAll(`/api/proxy/teams/${id}/members`, { params }, token);
export const postInviteUsersToTeam = (teamId, body, token) => create(`/api/proxy/teams/${teamId}/invite`, body, token);
