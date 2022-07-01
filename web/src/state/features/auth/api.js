import { get, getAll, create, update, updateItem, patch } from '../../utils/api';

export const auth = (params) => create('/api/proxy/auth/token', params);
export const exchangeToken = (params) => create('/api/proxy/auth/refresh-token', params);
export const getUser = (userId, token) => get('/api/proxy/users', userId, token);
export const createUser = (params) => create('/api/proxy/users', params);
export const putUser = (id, item, token) => updateItem(`/api/proxy/users`, id, item, token);
export const patchUser = (id, params, token) => patch(`/api/proxy/users/${id}`, params, token);
export const verifyUser = (params, token) => getAll(`/api/proxy/users/verification/${token}`, params);
export const resetVerification = (params) => create('/api/proxy/users/verification', params);
export const postUserOrg = (userId, params, token) => create(`/api/proxy/users/${userId}/organizations`, params, token);
export const togglePinnedUserRepo = (userId, body, token) => patch(`/api/proxy/users/${userId}/toggleUserRepoPinned`, body, token);
