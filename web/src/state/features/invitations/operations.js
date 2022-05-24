import * as actions from './actions';
import { authOperations } from '../auth';
import * as analytics from '../../../utils/analytics';

const { hydrateUser } = authOperations;

const trackSendInvite = (email, senderName, senderEmail, inviteType) => {
  analytics.segmentTrack(analytics.SEGMENT_EVENTS.INVITATION_SENT,
    { email, sender_name: senderName, sender_email: senderEmail, invite_type: inviteType });
};

const createInviteAndHydrateUser = (invitationData, token) => async (dispatch) => {
  try {
    const response = await dispatch(actions.createInvite(invitationData, token)) || {};
    if (!response.user) {
      return response;
    }
    const { recipient, senderName, senderEmail } = invitationData;
    trackSendInvite(recipient, senderName, senderEmail, 'user');
    dispatch(hydrateUser(response.user));
  } catch (err) {
    const error = new Error(err);
    return error;
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
  analytics.segmentTrack(analytics.SEGMENT_EVENTS.PRODUCT_SIGNUP, { email });
};

const trackTeamInviteAccepted = (teamId, traits) => {
  analytics.segmentGroup(teamId, traits);
};

export default {
  ...actions, createInviteAndHydrateUser, revokeInviteAndHydrateUser, trackRedeemedInvite, trackTeamInviteAccepted, trackSendInvite
};
