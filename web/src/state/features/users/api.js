import { getAll } from '../../utils/api';

export const getUsers = (orgId, token) => getAll(`/v1/organizations/${orgId}/users`, {}, token);
