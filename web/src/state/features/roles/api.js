import {getAll, patch, deleteItem} from '../../utils/api';

export const getRoles = (token) => getAll('/api/proxy/roles', {}, token);
export const patchUserRole = (userRoleId, data, token) => patch(`/api/proxy/user-roles/${userRoleId}`, data, token);
export const deleteUserRole = (organizationId, userRoleId, token) => deleteItem(`/api/proxy/user-roles/${organizationId}`, userRoleId, token);
