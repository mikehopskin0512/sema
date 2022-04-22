import { get, create, getAll, update, upload } from '../../utils/api';

export const getTeams = (token) => getAll('/api/proxy/teams', {}, token);
export const addTeam = (body, token) => create('/api/proxy/teams', body, token);
export const getTeamMetrics = (teamId, token) => getAll(`/api/proxy/teams/${teamId}/metrics`, {}, token);
export const getTeamRepos = (teamId, params, token) => getAll(`/api/proxy/teams/${teamId}/repositories`, { params }, token);
export const getTeamMembers = (id, params, token) => getAll(`/api/proxy/teams/${id}/members`, { params }, token);
export const postInviteUsersToTeam = (teamId, body, token) => create(`/api/proxy/teams/${teamId}/invite`, body, token);
export const postTeamInvitationEmailValidation = (teamId, body, token) => create(`/api/proxy/teams/${teamId}/invite/validate-emails`, body, token);
export const updateTeam = (body, token) => update('/api/proxy/teams', body, token);
export const updateTeamRepos = (teamId, body, token) => update(`/api/proxy/teams/${teamId}/repositories`, body, token);
export const getAllTeamCollections = (teamId, token) => getAll(`/api/proxy/comments/collections/all?teamId=${teamId}`, {}, token);
export const inviteToTeam = (teamId, token) => get('/api/proxy/teams/invite', teamId, token);
export const uploadAvatar = (teamId, body, token) => upload(`/api/proxy/teams/${teamId}/upload`, body, token);
