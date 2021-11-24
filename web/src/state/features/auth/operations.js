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
    analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.CLICKED_JOIN_WAITLIST, {});
    analytics.fireAmplitudeEvent(analytics.AMPLITUDE_EVENTS.VIEWED_DASHBOARD_PAGE, { url: PATHS.DASHBOARD });
    Router.push(PATHS.DASHBOARD);
  } catch (error) {
    const { response: { data: { message } = {}, status, statusText } = {} } = error || '';
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(triggerAlert(errMessage, 'error'));
  }
};

export default { ...actions, createAndJoinOrg, registerAndAuthUser };
