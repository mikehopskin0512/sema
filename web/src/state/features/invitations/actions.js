import * as types from './types';
import { getInvite, postInvite, getInvitations } from './api';
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

export const createInvite = (invitationData, token) => async (dispatch) => {
  const { recipient } = invitationData;
  try {
    dispatch(requestCreateInvite());
    const payload = await postInvite({ invitation: invitationData }, token);
    const { data: { invitation = {} } } = payload;

    dispatch(triggerAlert(`Invitation successfully sent to ${recipient}`, 'success'));
    dispatch(requestCreateInviteSuccess(invitation));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestCreateInviteError(errMessage));
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
  }
};

export const getInvitesBySender = (userId, token) => async (dispatch) => {
  try {
    dispatch(requestGetInvitesBySender());
    const params = {
      senderId: userId,
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
