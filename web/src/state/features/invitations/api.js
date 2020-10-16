import { get, create } from '../../utils/api';

export const postInvite = (params, token) => create('/api/proxy/invitations', params, token);
export const getInvite = (id) => get('/api/proxy/invitations', id);
