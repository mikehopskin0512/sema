import { getAll } from '../../utils/api';

export const getFileTypes = (orgId, token) => getAll(`/v1/organizations/${orgId}/fileTypes`, {}, token);
export const getRepositories = (orgId, token) => getAll(`/v1/organizations/${orgId}/repositories`, {}, token);
export const getContributors = (orgId, token) => getAll(`/v1/organizations/${orgId}/contributors`, {}, token);
