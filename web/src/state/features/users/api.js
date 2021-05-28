import { getAll, create, update } from '../../utils/api';

export const getUsers = (params) => getAll('/api/proxy/admin/users', { params });
export const updateUserInvitations = (userId, params) => create(`/api/proxy/admin/users/${userId}/invitations`, params);
export const updateUserStatus = (userId, params) => update(`/api/proxy/admin/users/${userId}/status`, params);
