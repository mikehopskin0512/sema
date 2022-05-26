import Router from 'next/router';
import jwtDecode from 'jwt-decode';
import * as actions from './actions';
import { organizationsOperations } from '../organizations';
import { triggerAlert } from '../alerts/actions';
import * as analytics from '../../../utils/analytics';
import { PATHS } from '../../../utils/constants';

const { createOrg } = organizationsOperations;

const createAndJoinOrg = (userId, org, token) => async (dispatch) => {
  try {
    // Create new organization and await result
    const newOrg = await dispatch(createOrg(org, token)) || {};
    const { _id: orgId, orgName } = newOrg;

    if (!orgId) {
      throw new Error('Org create error');
    }

    // Update user record with new organization id
    const userOrg = { id: orgId, orgName, isAdmin: true };
    await dispatch(actions.joinOrg(userId, userOrg, token));
  } catch (err) {
    const error = new Error(err);
    return error;
  }

  return true;
};

const registerAndAuthUser = (user, invitation = {}) => async (dispatch) => {
  try {
    const payload = await dispatch(actions.registerUser(user, invitation));
    if (!payload) { return false; }

    const { data: { jwtToken } = {} } = payload;
    const { verificationToken } = jwtDecode(jwtToken) || {};

    await dispatch(actions.activateUser(verificationToken));
    const { firstName: first_name = '', lastName: last_name = '', username: email = '' } = user;
    analytics.segmentTrack(analytics.SEGMENT_EVENTS.WAITLIST_SIGNUP, { first_name, last_name, email });
    analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.CLICKED_JOIN_WAITLIST, {});
    analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.VIEWED_DASHBOARD_PAGE, { url: PATHS.DASHBOARD });
    Router.push(invitation?.organization ? `${PATHS.DASHBOARD}/?organizationId=${invitation?.organization}` : PATHS.DASHBOARD);
  } catch (error) {
    const { response: { data: { message } = {}, status, statusText } = {} } = error || '';
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(triggerAlert(errMessage, 'error'));
  }
};

const updateUserHasExtension = (user, token) => async (dispatch) => {
  const { hasExtension, segmentEvent = hasExtension
    ? analytics.SEGMENT_EVENTS.EXTENSION_INSTALLED
    : analytics.SEGMENT_EVENTS.EXTENSION_UNINSTALLED } = user;
  await dispatch(actions.updateUser(user, token));
  analytics.segmentTrack(segmentEvent, { isExtensionEnabled: hasExtension });
};

const trackUserLogin = () => {
  analytics.segmentTrack(analytics.SEGMENT_EVENTS.USER_LOGIN, {});
};

const trackUserLogout = () => {
  analytics.segmentTrack(analytics.SEGMENT_EVENTS.USER_LOGOUT, {});
  analytics.segmentReset();
};

const trackOnboardingCompleted = () => {
  analytics.segmentTrack(analytics.SEGMENT_EVENTS.ONBOARDING_COMPLETED, {});
};

export default {
  ...actions, createAndJoinOrg, registerAndAuthUser, updateUserHasExtension, trackUserLogin, trackUserLogout, trackOnboardingCompleted
};
