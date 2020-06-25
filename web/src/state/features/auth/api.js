import { create } from '../../utils/apiApollo';

export const auth = (params) => create('v1/auth/token', params);
export const exchangeToken = (params) => create('v1/auth/refresh-token', params);
export const createUser = (params) => create('/v1/users', params);
