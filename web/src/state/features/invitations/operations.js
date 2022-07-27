import * as actions from './actions';
import { authOperations } from '../auth';
import * as analytics from '../../../utils/analytics';

const { hydrateUser } = authOperations;

const trackSendInvite = (email, senderName, senderEmail, inviteType) => {
  analytics.segmentTrack(analytics.SEGMENT_EVENTS.INVITATION_SENT,
    { email, sender_name: senderName, sender_email: senderEmail, invite_type: inviteType });
};

const createInviteAndHydrateUser = (invitationData, token) => async (dispatch) => {
  const { isMagicLink } = invitationData;

  if (isMagicLink) return;

  try {
    const response = await dispatch(actions.createInvite(invitationData, token)) || {};

    if (!response.user) return response;

    const { firstName, lastName, username  } = response.user;

    const { recipient } = invitationData;

    const userName = `${firstName} ${lastName}`

    trackSendInvite(recipient, userName, username, 'user');
    dispatch(hydrateUser(response.user));
  } catch (err) {
    return  new Error(err);
  }

  return { status: 201 };
};

const revokeInviteAndHydrateUser = (id, userId, token, recipient) => async (dispatch) => {
  try {
    const response = await dispatch(actions.revokeInvite(id, userId, token, recipient)) || {};
    if (!response.user) {
      throw new Error('No user returned!');
    }
    dispatch(hydrateUser(response.user));
  } catch (err) {
    const error = new Error(err);
    return error;
  }

  return true;
};

const trackRedeemedInvite = (email) => {
  analytics.segmentTrack(analytics.SEGMENT_EVENTS.INVITATION_ACCEPTED, { email });
};

const trackOrganizationInviteAccepted = (organizationId, traits) => {
  analytics.segmentGroup(organizationId, traits);
};

export default {
  ...actions, createInviteAndHydrateUser, revokeInviteAndHydrateUser, trackRedeemedInvite, trackOrganizationInviteAccepted, trackSendInvite
};
