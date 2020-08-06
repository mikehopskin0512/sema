import { getAll, create } from '../../utils/apiApollo';

export const auth = (params) => create('v1/auth/token', params);
export const exchangeToken = (params) => create('v1/auth/refresh-token', params);
export const createUser = (params) => create('/v1/users', params);
export const verifyUser = (params, token) => getAll(`/v1/users/verification/${token}`, params);
export const resetVerification = (params) => create('/v1/users/verification', params);
