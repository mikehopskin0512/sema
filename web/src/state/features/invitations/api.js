import { get, create, getAll } from '../../utils/api';

export const postInvite = (params, token) => create('/api/proxy/invitations', params, token);
export const getInvite = (id) => get('/api/proxy/invitations', id);
export const getInvitations = (params, token) => getAll('/api/proxy/invitations', { params }, token);
export const postResendInvite = (params, token) => create('/api/proxy/invitations/send', params, token);
