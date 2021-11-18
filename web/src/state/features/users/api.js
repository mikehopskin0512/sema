import { getAll, create, update, get, exportItem } from '../../utils/api';

export const getUsers = (params) => getAll('/api/proxy/admin/users', { params });
export const updateUserInvitations = (userId, params) => create(`/api/proxy/admin/users/${userId}/invitations`, params);
export const updateUserStatus = (userId, params) => update(`/api/proxy/admin/users/${userId}/status`, params);
export const getUser = (userId, token) => get('/api/proxy/admin/users', userId, token);
export const bulkAdmit = (params) => create('/api/proxy/admin/users/bulk-admit', params);
export const putUser = (userId, params) => update(`/api/proxy/admin/users/${userId}`, params);
export const getTimeToValueMetric = (params) => getAll('/api/proxy/admin/users/time-to-value', { params });
export const exportTimeToValue = (params, token) => exportItem('/api/proxy/admin/users/time-to-value/export', params, token);
export const exportUsersApi = (params, token) => exportItem('/api/proxy/admin/users/export', params, token);
