import { getAll } from '../../utils/api';

export const getFileTypes = (orgId, token) => getAll(`/api/proxy/organizations/${orgId}/fileTypes`, {}, token);
export const getRepositories = (orgId, token) => getAll(`/api/proxy/organizations/${orgId}/repositories`, {}, token);
export const getContributors = (orgId, token) => getAll(`/api/proxy/organizations/${orgId}/contributors`, {}, token);
