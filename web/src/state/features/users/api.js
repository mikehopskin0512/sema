import { getAll } from '../../utils/api';

export const getUsers = (params, token) => getAll('/v1/users', { params }, token);
