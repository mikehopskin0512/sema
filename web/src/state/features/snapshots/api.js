import { create, get, updateItem, update, getAll } from '../../utils/api';

export const getSnapshotsByUserId = (userId, token) => get('/api/proxy/snapshots', userId, token);
export const getUserSnapshots = (userId, token) => getAll(`/api/proxy/users/${userId}/snapshots`, {}, token);
export const postSnapshots = (params, token) => create('/api/proxy/snapshots', params, token);
export const putSnapshot = (id, body, token) => updateItem('/api/proxy/snapshots', id, body, token);
export const deleteSnapshot = (body, token) => update(`/api/proxy/snapshots/remove/${body.snapshotId}`, body, token);
