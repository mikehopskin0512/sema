import { get, create, getAll, patch, deleteItem, exportItem } from '../../utils/api';

export const postInvite = (params, token) => create('/api/proxy/invitations', params, token);
export const getInvite = (id) => get('/api/proxy/invitations', id);
export const getInvitations = (params, token) => getAll('/api/proxy/invitations', { params }, token);
export const postResendInvite = (params, token) => create('/api/proxy/invitations/send', params, token);
export const patchRedeemInvite = (invitationToken, params, token) => patch(`/api/proxy/invitations/${invitationToken}/redeem`, params, token);
export const deleteInvite = (id, token) => deleteItem('/api/proxy/invitations', id, token);
export const getInvitationsMetric = (params, token) => getAll('/api/proxy/invitations/metric', { params }, token);
export const exportInvitationsMetric = (params, token) => exportItem('/api/proxy/invitations/metric/export', params, token);
