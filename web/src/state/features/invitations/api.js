import { get, create, getAll, patch, exportItem } from '../../utils/api';

export const postInvite = (params, token) => create('/api/proxy/invitations', params, token);
export const getInvite = (id) => get('/api/proxy/invitations', id);
export const getInvitations = (params, token) => getAll('/api/proxy/invitations', { params }, token);
export const postResendInvite = (id, token) => create('/api/proxy/invitations/send', { id }, token);
export const postAcceptInvite = (invitationToken, params, token) => create(`/api/proxy/invitations/accept/${invitationToken}`, params, token);
export const patchRedeemInvite = (invitationToken, token) => patch(`/api/proxy/invitations/${invitationToken}/redeem`, {}, token);
export const revokeInvite = (id, token) => patch(`/api/proxy/invitations/${id}/revoke`, {}, token);
export const getInvitationsMetric = (params, token) => getAll('/api/proxy/invitations/metric', { params }, token);
export const exportInvitationsMetric = (params, token) => exportItem('/api/proxy/invitations/metric/export', params, token);
export const exportInvitations = (params, token) => exportItem('/api/proxy/invitations/export', params, token);
