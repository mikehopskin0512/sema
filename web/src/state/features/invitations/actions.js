import { format } from 'date-fns';
import * as types from './types';
import { getInvite, postInvite, getInvitations, postResendInvite, deleteInvite, getInvitationsMetric, exportInvitationsMetric } from './api';
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

const requestGetInvitesBySenderSuccess = (invitation) => ({
  type: types.REQUEST_GET_INVITES_BY_SENDER_SUCCESS,
  invitation,
});

const requestGetInvitesBySenderError = (errors) => ({
  type: types.REQUEST_GET_INVITES_BY_SENDER_ERROR,
  errors,
});

const requestResendInvite = () => ({
  type: types.REQUEST_RESEND_INVITE,
});

const requestResendInviteSuccess = (invitation) => ({
  type: types.REQUEST_RESEND_INVITE_SUCCESS,
  invitation,
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

export const getInvitesBySender = (userId, token, search) => async (dispatch) => {
  try {
    dispatch(requestGetInvitesBySender());
    const params = {
      senderId: userId,
      search
    };
    const payload = await getInvitations(params, token);
    const { data: { data } } = payload;

    dispatch(requestGetInvitesBySenderSuccess(data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestGetInvitesBySenderError(errMessage));
  }
};

export const resendInvite = (recipient, token) => async (dispatch) => {
  try {
    dispatch(requestResendInvite());
    const payload = await postResendInvite({ recipient }, token);
    const { data: { invitation = {} } } = payload;
    dispatch(triggerAlert(`Invitation successfully sent to ${recipient}`, 'success'));

    dispatch(requestResendInviteSuccess(invitation));
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
    dispatch(getInvitesBySender(userId, token));
    dispatch(triggerAlert(`Invitation sent to ${recipient} is revoked!`, 'success'));
    dispatch(requestDeleteInviteSuccess());
    return { user };
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestDeleteInviteError(errMessage));
  }
};

export const fetchInviteMetrics = (type) => async (dispatch) => {
  try {
    dispatch(requestFetchInviteMetrics());
    const payload = await getInvitationsMetric({ type });
    const { data: { invites = {} } } = payload;

    dispatch(requestFetchInviteMetricsSuccess(invites));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchInviteMetricsError(errMessage));
  }
};

export const exportInviteMetrics = async (type, token) => {
  try {
    const payload = await exportInvitationsMetric({ type }, token);
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
