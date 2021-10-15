import { get } from '../../utils/api';

export const getUser = (userId, token) => get('/api/proxy/admin/users', userId, token);
