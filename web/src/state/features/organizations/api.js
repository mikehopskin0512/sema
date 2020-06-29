import { getAll } from '../../utils/apiApollo';

export const getFileTypes = (orgId, token) => getAll(`/v1/organizations/${orgId}/fileTypes`, {}, token);
export const getRepositories = (orgId, token) => getAll(`/v1/organizations/${orgId}/repositories`, {}, token);
export const getUsers = (orgId, token) => getAll(`/v1/organizations/${orgId}/users`, {}, token);
