import { get, create, getAll, update, upload, patch } from '../../utils/api';

export const getOrganizations = (token) => getAll('/api/proxy/organizations', {}, token);
export const addOrganization = (body, token) => create('/api/proxy/organizations', body, token);
export const getOrganizationMetrics = (organizationId, token) => getAll(`/api/proxy/organizations/${organizationId}/metrics`, {}, token);
export const getOrganizationRepos = (organizationId, params, token) => getAll(`/api/proxy/organizations/${organizationId}/repositories`, { params }, token);
export const getOrganizationMembers = (id, params, token) => getAll(`/api/proxy/organizations/${id}/members`, { params }, token);
export const postInviteUsersToOrganization = (organizationId, body, token) => create(`/api/proxy/organizations/${organizationId}/invite`, body, token);
export const postOrganizationInvitationEmailValidation = (organizationId, body, token) => create(`/api/proxy/organizations/${organizationId}/invite/validate-emails`, body, token);
export const updateOrganization = (body, token) => update('/api/proxy/organizations', body, token);
export const updateOrganizationRepos = (organizationId, body, token) => update(`/api/proxy/organizations/${organizationId}/repositories`, body, token);
export const getAllOrganizationCollections = (organizationId, token) => getAll(`/api/proxy/comments/collections/all?organizationId=${organizationId}`, {}, token);
export const inviteToOrganization = (organizationId, token) => get('/api/proxy/organizations/invite', organizationId, token);
export const uploadAvatar = (organizationId, body, token) => upload(`/api/proxy/organizations/${organizationId}/upload`, body, token);
export const togglePinnedOrgRepo = (organizationId, body, token) => patch(`/api/proxy/organizations/${organizationId}/pinned-repos`, body, token);
