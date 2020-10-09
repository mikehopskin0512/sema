import { create, getAll } from '../../utils/api';

export const postOrganization = (params, token) => create('/api/proxy/organizations', params, token);
export const getOrganization = (params, token) => getAll('/api/proxy/organizations', { params }, token);
export const getFileTypes = (orgId, token) => getAll(`/api/proxy/organizations/${orgId}/fileTypes`, {}, token);
export const getRepositories = (orgId, token) => getAll(`/api/proxy/organizations/${orgId}/repositories`, {}, token);
export const getContributors = (orgId, token) => getAll(`/api/proxy/organizations/${orgId}/contributors`, {}, token);
