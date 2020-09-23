import { getAll, create } from '../../utils/api';

export const auth = (params) => create('/api/proxy/auth/token', params);
export const exchangeToken = (params) => create('/api/proxy/auth/refresh-token', params);
export const createUser = (params) => create('/api/proxy/users', params);
export const verifyUser = (params, token) => getAll(`/api/proxy/users/verification/${token}`, params);
export const resetVerification = (params) => create('/api/proxy/users/verification', params);
