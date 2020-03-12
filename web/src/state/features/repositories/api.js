import { getAll } from '../../utils/api';

export const getRepositories = (orgId, token) => getAll(`/v1/organizations/${orgId}/repositories`, {}, token);
export const somethingElse = '';
