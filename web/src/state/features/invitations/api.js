import { get, create, getAll, patch, deleteItem } from '../../utils/api';

export const postInvite = (params, token) => create('/api/proxy/invitations', params, token);
export const getInvite = (id) => get('/api/proxy/invitations', id);
export const getInvitations = (params, token) => getAll('/api/proxy/invitations', { params }, token);
export const postResendInvite = (params, token) => create('/api/proxy/invitations/send', params, token);
export const patchRedeemInvite = (invitationToken, params, token) => patch(`/api/proxy/invitations/${invitationToken}/redeem`, params, token);
export const deleteInvite = (id, token) => deleteItem('/api/proxy/invitations', id, token);
