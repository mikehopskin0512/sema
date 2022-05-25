import { get, create, getAll, update, upload } from '../../utils/api';

export const getOrganizations = (token) => getAll('/api/proxy/teams', {}, token);
export const addOrganization = (body, token) => create('/api/proxy/teams', body, token);
export const getOrganizationMetrics = (teamId, token) => getAll(`/api/proxy/teams/${teamId}/metrics`, {}, token);
export const getOrganizationRepos = (teamId, params, token) => getAll(`/api/proxy/teams/${teamId}/repositories`, { params }, token);
export const getOrganizationMembers = (id, params, token) => getAll(`/api/proxy/teams/${id}/members`, { params }, token);
export const postInviteUsersToOrganization = (teamId, body, token) => create(`/api/proxy/teams/${teamId}/invite`, body, token);
export const postOrganizationInvitationEmailValidation = (teamId, body, token) => create(`/api/proxy/teams/${teamId}/invite/validate-emails`, body, token);
export const updateOrganization = (body, token) => update('/api/proxy/teams', body, token);
export const updateOrganizationRepos = (teamId, body, token) => update(`/api/proxy/teams/${teamId}/repositories`, body, token);
export const getAllOrganizationCollections = (teamId, token) => getAll(`/api/proxy/comments/collections/all?teamId=${teamId}`, {}, token);
export const inviteToOrganization = (teamId, token) => get('/api/proxy/teams/invite', teamId, token);
export const uploadAvatar = (teamId, body, token) => upload(`/api/proxy/teams/${teamId}/upload`, body, token);
