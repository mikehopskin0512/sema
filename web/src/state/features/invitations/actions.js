import { format } from 'date-fns';
import * as types from './types';
import {
  getInvite, postInvite, getInvitations,
  patchRedeemInvite, postResendInvite, deleteInvite,
  getInvitationsMetric, exportInvitationsMetric, exportInvitations,
  postAcceptInvite
} from './api';
import { alertOperations } from '../alerts';

const { triggerAlert, clearAlert } = alertOperations;

const requestCreateInvite = () => ({
  type: types.REQUEST_CREATE_INVITE,
});

const requestCreateInviteSuccess = (invitation) => ({
  type: types.REQUEST_CREATE_INVITE_SUCCESS,
  invitation,
});

const requestCreateInviteError = (errors) => ({
  type: types.REQUEST_CREATE_INVITE_ERROR,
  errors,
});

const requestFetchInvite = () => ({
  type: types.REQUEST_FETCH_INVITE,
});

const requestFetchInviteSuccess = (invitation) => ({
  type: types.REQUEST_FETCH_INVITE_SUCCESS,
  invitation,
});

const requestFetchInviteError = (errors) => ({
  type: types.REQUEST_FETCH_INVITE_ERROR,
  errors,
});

const requestGetInvitesBySender = () => ({
  type: types.REQUEST_GET_INVITES_BY_SENDER,
});

const requestGetInvitesBySenderSuccess = ({invitations, pendingInvites, acceptedInvites}) => ({
  type: types.REQUEST_GET_INVITES_BY_SENDER_SUCCESS,
  invitations,
  pendingInvites,
  acceptedInvites
});

const requestGetInvitesBySenderError = (errors) => ({
  type: types.REQUEST_GET_INVITES_BY_SENDER_ERROR,
  errors,
});

const requestResendInvite = () => ({
  type: types.REQUEST_RESEND_INVITE,
});

const requestResendInviteError = (errors) => ({
  type: types.REQUEST_RESEND_INVITE_ERROR,
  errors,
});

const requestDeleteInvite = () => ({
  type: types.REQUEST_DELETE_INVITE,
});

const requestDeleteInviteSuccess = () => ({
  type: types.REQUEST_DELETE_INVITE_SUCCESS,
});

const requestDeleteInviteError = (errors) => ({
  type: types.REQUEST_DELETE_INVITE_ERROR,
  errors,
});

const requestRedeemInvite = () => ({
  type: types.REQUEST_REDEEM_INVITE,
});

const requestRedeemInviteSuccess = (response) => ({
  type: types.REQUEST_REDEEM_INVITE_SUCCESS,
  response,
});

const requestRedeemInviteError = (errors) => ({
  type: types.REQUEST_REDEEM_INVITE_ERROR,
  errors,
});

const requestFetchInviteMetrics = () => ({
  type: types.REQUEST_FETCH_INVITE_METRICS,
});

const requestFetchInviteMetricsSuccess = (invitations) => ({
  type: types.REQUEST_FETCH_INVITE_METRICS_SUCCESS,
  invitations,
});

const requestFetchInviteMetricsError = (errors) => ({
  type: types.REQUEST_FETCH_INVITE_METRICS_ERROR,
  errors,
});

const requestAcceptInvitation = () => ({
  type: types.REQUEST_ACCEPT_INVITATION,
});

const requestAcceptInvitationSuccess = (invitation) => ({
  type: types.REQUEST_ACCEPT_INVITATION_SUCCESS,
});

const requestAcceptInvitationError = (errors) => ({
  type: types.REQUEST_ACCEPT_INVITATION_ERROR,
  errors,
});

export const createInvite = (invitationData, token) => async (dispatch) => {
  const { recipient } = invitationData;
  try {
    dispatch(requestCreateInvite());
    const payload = await postInvite({ invitation: invitationData }, token);
    const { data: { invitation = {}, user } } = payload;

    dispatch(triggerAlert(`Invitation successfully sent to ${recipient}`, 'success'));
    dispatch(requestCreateInviteSuccess(invitation));
    return { invitation, user };
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestCreateInviteError(errMessage));
    return error.response;
  }
};

export const fetchInvite = (inviteToken) => async (dispatch) => {
  try {
    dispatch(requestFetchInvite());
    const payload = await getInvite(inviteToken);
    const { data: { invitation = {} } } = payload;

    dispatch(requestFetchInviteSuccess(invitation));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchInviteError(errMessage));
    dispatch(triggerAlert(`${errMessage}`, 'error'));
  }
};

export const getInvitesBySender = (params, token) => async (dispatch) => {
  try {
    dispatch(requestGetInvitesBySender());
    const p = {
      senderId: params.userId,
      ...params
    };
    const payload = await getInvitations(p, token);
    const { data } = payload;
    dispatch(requestGetInvitesBySenderSuccess(data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestGetInvitesBySenderError(errMessage));
  }
};

export const redeemInvite = (invitationToken, userId, token) => async (dispatch) => {
  try {
    dispatch(requestRedeemInvite());
    const payload = await patchRedeemInvite(invitationToken, { userId }, token);
    const { data: { response } } = payload;
    dispatch(requestRedeemInviteSuccess(response));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestRedeemInviteError(errMessage));
  }
};

export const resendInvite = (invitationId, token) => async (dispatch) => {
  try {
    dispatch(requestResendInvite());
    const { data: { recipient } } = await postResendInvite(invitationId, token);
    dispatch(triggerAlert(`Invitation successfully sent to ${recipient}`, 'success'));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestResendInviteError(errMessage));
  }
};

export const revokeInvite = (id, userId, token, recipient) => async (dispatch) => {
  try {
    dispatch(requestDeleteInvite());
    const payload = await deleteInvite(id, token);
    const { data: { user }} = payload;
    dispatch(getInvitesBySender({ userId }, token));
    dispatch(triggerAlert(`Invitation sent to ${recipient} is revoked!`, 'success'));
    dispatch(requestDeleteInviteSuccess());
    return { user };
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestDeleteInviteError(errMessage));
  }
};

export const acceptInvite = (invitationToken, token) => async (dispatch) => {
  try {
    dispatch(requestAcceptInvitation());
    await postAcceptInvite(invitationToken, { }, token);
    dispatch(requestAcceptInvitationSuccess());
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestAcceptInvitationError(errMessage));
  }
};

export const fetchInviteMetrics = (type, timeRange) => async (dispatch) => {
  try {
    dispatch(requestFetchInviteMetrics());
    const payload = await getInvitationsMetric({ type, timeRange });
    const { data: { invites = {} } } = payload;

    dispatch(requestFetchInviteMetricsSuccess(invites));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchInviteMetricsError(errMessage));
  }
};

export const exportInviteMetrics = async (type, timeRange, token) => {
  try {
    const payload = await exportInvitationsMetric({ type, timeRange }, token);
    const { data } = payload;

    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `metric_${format(new Date(), 'yyyyMMdd')}.csv`);

    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error(error);
  }
};

export const exportInvites = async (params, token) => {
  try {
    const payload = await exportInvitations(params, token);
    const {data} = payload;

    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `invites_${format(new Date(), 'yyyyMMdd')}.csv`);

    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error(error);
  }
};
