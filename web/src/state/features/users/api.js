import { getAll, create, update, get } from '../../utils/api';

export const getUsers = (params) => getAll('/api/proxy/admin/users', { params });
export const updateUserInvitations = (userId, params) => create(`/api/proxy/admin/users/${userId}/invitations`, params);
export const updateUserStatus = (userId, params) => update(`/api/proxy/admin/users/${userId}/status`, params);
export const getUser = (userId, token) => get('/api/proxy/admin/users', userId, token);
export const bulkAdmit = (params) => create('/api/proxy/admin/users/bulk-admit', params);
export const updateUser = (userId, params) => update(`/api/proxy/admin/users/${userId}`, params);
